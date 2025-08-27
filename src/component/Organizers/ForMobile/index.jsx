import React, { useEffect, useState } from 'react';
import './mobileOrganizerStyling.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Pagination } from 'swiper/modules';
import { useAuth } from '../../../pages/auth/AuthContext';
import Spinner from 'react-bootstrap/Spinner';
import { showToast } from '../../ToastAlert';

export default function MobileSingleOrganizers() {
  const [organizers, setOrganizers] = useState([]);
  const [followLoading, setFollowLoading] = useState({});
  const { token } = useAuth();

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch organizers');

      const data = await response.json();

      // Ensure "following" field exists
      const updatedData = data.data.map(org => ({
        ...org,
        following: org.following || false
      }));

      setOrganizers(updatedData);
    } catch (error) {
      console.error('Error fetching organizers:', error);
    }
  };

  const toggleFollow = async (organizerId) => {
    setFollowLoading(prev => ({ ...prev, [organizerId]: true }));
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/follow/${organizerId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to toggle follow');

      const result = await res.json();

      // Alert the API message
      // alert(result.message);
   showToast.info(result.message);
      // Update follow state in UI
      setOrganizers(prev =>
        prev.map(org =>
          org.id === organizerId
            ? { ...org, following: result.following }
            : org
        )
      );
    } catch (err) {
      console.error('Error toggling follow:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setFollowLoading(prev => ({ ...prev, [organizerId]: false }));
    }
  };

  const getOrganizerImage = (id) => {
    const randomImageId = id % 50;
    return `https://randomuser.me/api/portraits/${randomImageId % 2 === 0 ? 'men' : 'women'}/${randomImageId}.jpg`;
  };

  return (
    <div className="mobile-organizer-carousel mb-3">
      <Swiper
        modules={[Pagination]}
        spaceBetween={0}
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 3 },
          480: { slidesPerView: 4 },
          768: { slidesPerView: 4 },
        }}
      >
        {organizers.map((organizer) => (
          <SwiperSlide key={organizer.id}>
            <div className="mobile-organizer-card text-left">
              <img
                src={organizer.profileUrl?.url || getOrganizerImage(organizer.id)}
                alt={`${organizer.firstName} ${organizer.lastName}`}
                className="mobile-organizer-img"
              />
              <div className="mobile-organizer-info">
                <div className="mobile-organizer-name">
                  {organizer.firstName} {organizer.lastName}
                </div>
                <div className="mobile-organizer-phone">
                  {organizer.phoneNumber || 'No phone'}
                </div>
              </div>
           <button
                  type="button"
                  style={{ background: organizer.following ? '#8F07E7' : '#f2eef5ff' ,color: organizer.following ? 'white' : 'black' }}
                  className="btn btn-sm d-flex align-items-center w-100 p-0 pt-1 pb-1 mt-1 border-0"
                  onClick={() => toggleFollow(organizer.id)}
                  disabled={followLoading[organizer.id]}
                >
                  {followLoading[organizer.id] ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <span>{organizer.following ? 'Unfollow' : 'Follow'}</span>{' '}
                      <i className={organizer.following ? 'feather-user-check' : 'feather-user-plus'}></i>
                    </>
                  )}
                </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
