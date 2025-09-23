import React, { useEffect, useState, useCallback } from 'react';
import './eventSTyling.css';
import threeDot from '../../../assets/navbar_icons/threeDot.png';
import camera_icon from '../../../assets/navbar_icons/camera_icon.png';
import live_indicator from '../../../assets/navbar_icons/live_indicator.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../pages/auth/AuthContext';
import PopupCard from './PopupCard';

// Shimmer placeholder component
const EventShimmer = () => {
    return (
        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4">
            <div className="shadow-s rounded h-100 blog-card border-0 position-relative">
                <div className="shimmer-container">
                    <div className="shimmer-image"></div>
                    <div className="shimmer-content">
                        <div className="shimmer-line shimmer-title"></div>
                        <div className="shimmer-line shimmer-subtitle"></div>
                        <div className="shimmer-line shimmer-price"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function EventTemplate({ live }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [imageLoaded, setImageLoaded] = useState({});
    const [brokenImages, setBrokenImages] = useState({});
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        from: 0,
        to: 0,
        total: 0
    });
    const { user, token } = useAuth();

    const fetchEvents = async (page = 1, append = false) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/events?page=${page}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (append) {
                setEvents(prevEvents => [...prevEvents, ...response.data.data]);
            } else {
                setEvents(response.data.data);
            }
            
            setPagination({
                current_page: response.data.meta.current_page,
                last_page: response.data.meta.last_page,
                from: response.data.meta.from,
                to: response.data.meta.to,
                total: response.data.meta.total
            });
            
            const loadedMap = {};
            response.data.data.forEach(event => {
                loadedMap[event.id] = false;
            });
            setImageLoaded(prev => ({ ...prev, ...loadedMap }));
            setBrokenImages({});
        } catch (err) {
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (!user || !token) return;
        fetchEvents();
    }, [user]);

    // Infinite scroll handler
    const handleScroll = useCallback(() => {
        if (loadingMore || pagination.current_page >= pagination.last_page) return;

        // Check if we've scrolled near the bottom
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        // Load more when 80% from the bottom
        if (scrollTop + clientHeight >= scrollHeight * 0.8) {
            fetchEvents(pagination.current_page + 1, true);
        }
    }, [loadingMore, pagination.current_page, pagination.last_page]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleImageLoad = (eventId) => {
        setImageLoaded(prev => ({ ...prev, [eventId]: true }));
    };

    const handleImageError = (eventId) => {
        setBrokenImages(prev => ({ ...prev, [eventId]: true }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const truncateText = (text, max = 20) => {
        if (!text) return '';
        return text.length > max ? `${text.substring(0, max)}...` : text;
    };

    return (
        <>
            <div className="row">
                {/* Show shimmer placeholders while loading */}
                {loading && Array.from({ length: 8 }).map((_, index) => (
                    <EventShimmer key={`shimmer-${index}`} />
                ))}
                
                {/* Display actual events when loaded */}
                {!loading && events.map(event => (
                    <div key={event.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4">
                        <div className="shadow-s rounded h-100 blog-card border-0 position-relative ">
                            <div className="overlay-icon" onClick={() => setSelectedEvent(event)}>
                                <img src={threeDot} alt="Options" />
                            </div>

                            {live && (
                                <>
                                    <div className="camera-overlay-icon">Live <img src={camera_icon} alt="Live" /></div>
                                    <div className="viewers-overlay-icon">
                                        <img className='viewers_indicator' src={live_indicator} alt="Live indicator" />
                                        38M Viewers
                                    </div>
                                </>
                            )}

                            <Link to={`/event/view/${event.id}`} className="text-decoration-none text-dark">
                                <div style={{ position: 'relative', height: '200px' }}>
                                    <img
                                        className="card-img-top"
                                        src={
                                            brokenImages[event.id]
                                                ? 'https://source.unsplash.com/random/1000x600'
                                                : event?.poster?.[0]?.url || 'https://source.unsplash.com/random/1000x600'
                                        }
                                        alt={event.title}
                                        style={{
                                            height: '200px',
                                            width: '100%',
                                            objectFit: 'cover',
                                        }}
                                        onLoad={() => handleImageLoad(event.id)}
                                        onError={() => handleImageError(event.id)}
                                    />
                                </div>

                                <div className='d-flex justify-content-between align-items-center w-100 pt-2 pb-0 pr-2 pl-2'>
                                    <div className='bg-da eventName' style={{ width: '65%' }}>
                                        <h6 className="pt-2  event_title" style={{ lineHeight: '15px' }}><b>{truncateText(event.title, 20)}</b></h6>
                                        <small className="event_time text-muted text-truncat" >
                                            {truncateText(formatDate(event.eventDate), 23)}
                                        </small>
                                    </div>
                                    <div style={{ width: '35%', textAlign: 'right' }}>
                                        <h6 className="event_price ">
                                            ${event.price ? event.price : '0.00'}
                                        </h6>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Loading more shimmer */}
            {loadingMore && (
                <div className="row">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <EventShimmer key={`more-shimmer-${index}`} />
                    ))}
                </div>
            )}

            {/* End of results message */}
            {!loadingMore && pagination.current_page >= pagination.last_page && events.length > 0 && (
                <div className="text-center mt-3 mb-4">
                    <p className="text-muted">You've reached the end of all events</p>
                </div>
            )}

            {/* Results Count */}
            {/* {!loading && (
                <div className="text-center text-muted small mt-2">
                    Showing {events.length} of {pagination.total} events
                </div>
            )} */}

            {selectedEvent && <PopupCard post={selectedEvent} onClose={() => setSelectedEvent(null)} />}

            {!loading && events.length === 0 && (
                <div className="text-center mt-3">
                    <span>No events available</span>
                </div>
            )}
        </>
    );
}