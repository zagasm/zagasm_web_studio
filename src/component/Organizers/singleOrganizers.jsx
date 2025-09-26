import React, { useEffect, useState } from 'react';
import './organizerStyling.css';
import { useAuth } from '../../pages/auth/AuthContext';

export default function SingleOrganizers() {
    const [organizers, setOrganizers] = useState([]);
    const [visibleOrganizers, setVisibleOrganizers] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true); // Start with true to show initial loader
    const [hasMore, setHasMore] = useState(true);
    const [imageErrors, setImageErrors] = useState({});
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/organisers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Fetch organizers response:', response);
            if (!response.ok) {
                throw new Error('Failed to fetch organizers');
            }
            const data = await response.json();
            console.log('API Response:', data);
            setOrganizers(data.organisers || []);
            setHasMore((data.organisers || []).length > 0);
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
        const randomImageId = id % 50;
        return `https://randomuser.me/api/portraits/${randomImageId % 2 === 0 ? 'men' : 'women'}/${randomImageId}.jpg`;
    };

    // Default fallback image
    const getDefaultImage = (id) => {
        return `https://ui-avatars.com/api/?name=Organizer&background=random&size=200&bold=true`;
    };

    // Handle image loading errors
    const handleImageError = (organizerId, imageType = 'profile') => {
        setImageErrors(prev => ({
            ...prev,
            [`${organizerId}-${imageType}`]: true
        }));
    };

    // Get image source with fallback
    const getImageSource = (organizer, imageType = 'profile') => {
        const errorKey = `${organizer.id}-${imageType}`;
        
        if (imageErrors[errorKey]) {
            return getDefaultImage(organizer.id);
        }

        if (imageType === 'profile') {
            return organizer.profileImage || getOrganizerImage(organizer.id);
        }
        
        return getOrganizerImage(organizer.id);
    };

    const truncateText = (text, max = 20) => {
        if (!text) return '';
        return text.length > max ? `${text.substring(0, max)}...` : text;
    };

    // Helper function to extract first and last name from organiser string
    const getNameParts = (organiserName) => {
        if (!organiserName) return { firstName: '', lastName: '' };
        
        const nameParts = organiserName.split(' ');
        if (nameParts.length === 1) {
            return { firstName: nameParts[0], lastName: '' };
        }
        
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        return { firstName, lastName };
    };

    // Shimmer Loader Component
    const ShimmerLoader = () => (
        <>
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-5">
                    <div className="organizer_section shadow-s rounded h-100 blog-card border-0 position-relative shimmer">
                        <div className="shimmer-image"></div>
                        <div className='save-event-detai align-items-center w-100 pt-3 pb-0 pr-2 pl-2'>
                            <div>
                                <div className='d-flex justify-content-between m-0 p-0'>
                                    <div className="shimmer-text shimmer-name"></div>
                                    <div className="shimmer-text shimmer-price"></div>
                                </div>
                                <div className="shimmer-text shimmer-type"></div>
                                <div className="shimmer-text shimmer-events"></div>
                                <div className="organizers_views border-rounded shimmer-viewers">
                                    <div className="d-flex align-items-center mb-3 job-item-body">
                                        <div className="overlap-rounded-circle">
                                            {[1, 2, 3, 4, 5].map((_, idx) => (
                                                <div key={idx} className="shimmer-avatar"></div>
                                            ))}
                                        </div>
                                        <div className="shimmer-text shimmer-views"></div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="shimmer-text shimmer-upcoming-title"></div>
                                <div className="upcoming_event">
                                    {[1, 2, 3].map((_, idx) => (
                                        <div key={idx} className="shimmer-event-image"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );

    return (
        <>
            {/* Show shimmer loader while loading */}
            {loading && <ShimmerLoader />}

            {/* Show organizers when loaded */}
            {!loading && visibleOrganizers.map(organizer => {
                const { firstName, lastName } = getNameParts(organizer.organiser);
                
                return (
                    <div key={organizer.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-5">
                        <div className="organizer_section shadow-s rounded h-100 blog-card border-0 position-relative">
                            <a href="#" className="text-decoration-none text-dark">
                                <img
                                    className="card-img-top"
                                    src={getImageSource(organizer, 'profile')}
                                    alt={organizer.organiser}
                                    loading="lazy"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    onError={() => handleImageError(organizer.id, 'profile')}
                                />
                                <div className='save-event-detai align-items-center w-100 pt-3 pb-0 pr-2 pl-2'>
                                    <div>
                                        <div className='d-flex justify-content-between m-0 p-0'>
                                            <div className="organizer_name">
                                                {truncateText(firstName, 10)} {truncateText(lastName, 10)}
                                            </div>
                                            <div className="font-weight-bolder organizer_price">$20</div>
                                        </div>
                                        <div className="organizer_type mb-1 p-0 mt-0">Artist</div>
                                        <div className="Event_No mb-2">
                                            <span className='mr-1' style={{ color: 'rgba(143, 7, 231, 1)' }}>@</span>
                                            {organizer.totalEventsCreated || 0} events
                                        </div>
                                        <div className="organizers_views border-rounded" style={{ background: 'rgba(244, 230, 253, 1)', borderRadius: '8px' }}>
                                            <div className="d-flex align-items-center mb-3 job-item-body">
                                                <div className="overlap-rounded-circle">
                                                    {[1, 2, 3, 4, 5].map((_, index) => (
                                                        <img
                                                            key={index}
                                                            className="rounded-circle shadow-sm user_template_img"
                                                            src={getImageSource(organizer, `viewer-${index}`)}
                                                            alt={`Viewer ${index}`}
                                                            onError={() => handleImageError(organizer.id, `viewer-${index}`)}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-weight-lighter">
                                                    +{organizer.numberOfFollowers ? Math.floor(organizer.numberOfFollowers / 1000) + 'K' : '0'} views
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h6 className="event-price mb-2">Upcoming: </h6>
                                        <div className="upcoming_event">
                                            {[1, 2, 3].map((_, index) => (
                                                <img
                                                    key={index}
                                                    className="shadow-sm user_template_img"
                                                    src={getImageSource(organizer, `event-${index}`)}
                                                    alt={`Event ${index}`}
                                                    onError={() => handleImageError(organizer.id, `event-${index}`)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                );
            })}

            {/* Show loading indicator for infinite scroll */}
            {!loading && hasMore && visibleOrganizers.length > 0 && (
                <div className="col-12 text-center mt-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading more organizers...</span>
                    </div>
                </div>
            )}
        </>
    );
}