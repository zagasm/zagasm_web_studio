import React, { useEffect, useState } from 'react';
import './organizerStyling.css';
import { useAuth } from '../../pages/auth/AuthContext';

export default function SingleOrganizers() {
    const [organizers, setOrganizers] = useState([]);
    const [visibleOrganizers, setVisibleOrganizers] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const organizersPerPage = 8;
    const { user, token } = useAuth();
    useEffect(() => {
        fetchOrganizers();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
        if (organizers.length > 0) {
            loadOrganizers(page);
        }
    }, [page, organizers]);
    const fetchOrganizers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch organizers');
            }
            const data = await response.json();
            console.log(data.data)
            setOrganizers(data.data); // Assuming the API returns an array of organizers
            setHasMore(data.data.length > 0);
        } catch (error) {
            console.error('Error fetching organizers:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadOrganizers = (pageNumber) => {
        const start = (pageNumber - 1) * organizersPerPage;
        const end = start + organizersPerPage;
        const newOrganizers = organizers.slice(start, end);

        setVisibleOrganizers((prev) => [...prev, ...newOrganizers]);

        // Check if we've loaded all organizers
        if (end >= organizers.length) {
            setHasMore(false);
        }
    };

    const handleScroll = () => {
        if (loading || !hasMore) return;

        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const fullHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= fullHeight - 100) {
            setPage((prev) => prev + 1);
        }
    };

    // Function to generate a random image URL based on organizer id
    const getOrganizerImage = (id) => {
        const randomImageId = id % 50; // Ensure we get a number between 0-49
        return `https://randomuser.me/api/portraits/${randomImageId % 2 === 0 ? 'men' : 'women'}/${randomImageId}.jpg`;
    };
    const truncateText = (text, max = 20) => {
        if (!text) return '';
        return text.length > max ? `${text.substring(0, max)}...` : text;
    };
    return (
        <>
            {visibleOrganizers.map(organizer => (
                <div key={organizer.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-5">
                    <div className="organizer_section shadow-s rounded h-100 blog-card border-0 position-relative">
                        <a href="#" className="text-decoration-none text-dark">
                            <img
                                className="card-img-top"
                                src={organizer.profileUrl?.url || getOrganizerImage(organizer.id)}
                                alt={`${organizer.firstName} ${organizer.lastName}`}
                                loading="lazy"
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className='save-event-detai align-items-center w-100 pt-3 pb-0 pr-2 pl-2'>
                                <div>
                                    <div className='d-flex justify-content-between m-0 p-0'>
                                        <div className="organizer_name">
                                            {truncateText(organizer.firstName, 10)} {truncateText(organizer.lastName, 10)}
                                        </div>
                                        <div className="font-weight-bolder organizer_price">$20</div>
                                    </div>
                                    <div className="organizer_type mb-1 p-0 mt-0">Artist</div>
                                    <div className="Event_No mb-2">
                                        <span className='mr-1' style={{ color: 'rgba(143, 7, 231, 1)' }}>@</span>
                                        20 events
                                    </div>
                                    <div className="organizers_views border-rounded" style={{ background: 'rgba(244, 230, 253, 1)', borderRadius: '8px' }}>
                                        <div className="d-flex align-items-center mb-3 job-item-body">
                                            <div className="overlap-rounded-circle">
                                                {/* Generate random viewer avatars */}
                                                {[1, 2, 3, 4, 5].map((_, index) => (
                                                    <img
                                                        key={index}
                                                        className="rounded-circle shadow-sm user_template_img"
                                                        src={getOrganizerImage(organizer.id + index + 1)}
                                                        alt={`Viewer ${index}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-weight-lighter">+50K views</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h6 className="event-price mb-2">Upcoming: </h6>
                                    <div className="upcoming_event">
                                        {/* Generate random upcoming event images */}
                                        {[1, 2, 3].map((_, index) => (
                                            <img
                                                key={index}
                                                className="shadow-sm user_template_img"
                                                src={getOrganizerImage(organizer.id + index + 10)}
                                                alt={`Event ${index}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            ))}
            {loading && (
                <div className="text-center mt-3">
                    <span>Loading organizers...</span>
                </div>
            )}

            {/* {!loading && hasMore && (
                <div className="text-center mt-3">
                    <span>Scroll to load more organizers</span>
                </div>
            )} */}
        </>
    );
}