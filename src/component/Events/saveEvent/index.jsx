import React, { useEffect, useState } from 'react';
import './SavedeventSTyling.css';
import heart_icon from '../../../assets/navbar_icons/heart_icon.png';
import { useAuth } from '../../../pages/auth/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// Enhanced shimmer loader
const ShimmerCard = () => (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mt-4">
        <div className="car shadow-s rounded h-100 blog-card border-0 position-relative shimmer-container">
            <div className="shimmer-heart shimmer-placeholder"></div>
            <div className="shimmer-image shimmer-placeholder"></div>
            <div className="save-event-detail d-flex justify-content-between align-items-center w-100 pt-3 pb-0 pr-2 pl-2">
                <div className="w-100">
                    <div className="shimmer-line shimmer-title shimmer-placeholder"></div>
                    <div className="d-flex align-items-center people-list mt-2">
                        <div className="dropdown-list-image mr-2 position-relative">
                            <div className="shimmer-avatar shimmer-placeholder"></div>
                        </div>
                        <div className="font-weight-bold mt-2 w-75">
                            <div className="shimmer-line shimmer-author shimmer-placeholder"></div>
                        </div>
                    </div>
                    <div className="shimmer-line shimmer-date shimmer-placeholder mt-2"></div>
                </div>
            </div>
        </div>
    </div>
);

export default function SaveEventTemplate() {
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const postsPerPage = 80000; // This is extremely high - consider reducing
    const { token,user } = useAuth();
  const navigate = useNavigate();
    useEffect(() => {
        fetchSavedEvents();
    }, [token]); // Added token as dependency

    useEffect(() => {
        if (allPosts.length > 0) {
            loadPosts(1);
        }
    }, [allPosts]);

const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return 'Date not available';
    
    try {
        // If no time is provided, just format the date
        if (!timeStr) {
            // Parse the full date string (e.g., "Wednesday, September 24, 2025")
            const date = new Date(dateStr);
            
            if (isNaN(date.getTime())) {
                return dateStr;
            }
            
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short' // Changed from 'long' to 'short' for abbreviated month
            });
        }
        
        // Parse the full date string (e.g., "Wednesday, September 24, 2025")
        const date = new Date(dateStr);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return `${dateStr} . ${timeStr}`;
        }
        
        // Format exactly as requested: "Wed, Sep 24 . 02:17"
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short' // Changed from 'long' to 'short' for abbreviated month
        });
        
        // Convert 12-hour time format to 24-hour format
        let hours = parseInt(timeStr.split(':')[0]);
        const minutes = timeStr.split(':')[1].split(' ')[0];
        const period = timeStr.includes('PM') || timeStr.includes('pm') ? 'PM' : 'AM';
        
        if (period === 'PM' && hours < 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        // Format time in 24-hour format with leading zeros
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
        
        return `${formattedDate} . ${formattedTime}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return `${dateStr}${timeStr ? ' . ' + timeStr : ''}`;
    }
};
    const fetchSavedEvents = async () => {
        if (!token) {
            setError('Authentication required');
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/events/saved/list`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            console.log('Saved Events Response:', res.data);
            
            if (res.data?.status && Array.isArray(res.data.data)) {
                const mappedPosts = res.data.data.map(event => ({
                    id: event.id,
                    image: event.poster && event.poster.length > 0 
                        ? event.poster[0].url 
                        : 'https://placehold.co/300x200?text=No+Image',
                    title: event.title || 'Untitled Event',
                    authorAvatar: event.hostImage || 'https://placehold.co/50x50?text=No+Image',
                    authorName: event.hostName || 'Unknown Host',
                    price: event.price || 0,
                    eventDate: event.eventDate || '',
                    startTime: event.startTime || '',
                    // Added additional fields that might be useful
                    description: event.description,
                    location: event.location,
                    eventType: event.eventType,
                    genre: event.genre,
                    shareable_link: event.shareable_link
                }));
                
                setAllPosts(mappedPosts);
                
                // If no saved events
                if (mappedPosts.length === 0) {
                    setError('You haven\'t saved any events yet.');
                }
            } else {
                setError('No saved events found');
            }
        } catch (error) {
            console.error('Error fetching saved events:', error);
            setError('Failed to load saved events. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadPosts = (pageNumber) => {
        const start = (pageNumber - 1) * postsPerPage;
        const end = start + postsPerPage;
        setVisiblePosts(allPosts.slice(start, end));
    };

    const truncateText = (text, max = 20) => {
        if (!text) return '';
        return text.length > max ? `${text.substring(0, max)}...` : text;
    };

    const handleCardClick = (selectedPost) => {
      navigate('/event/view/'+selectedPost.id);
    };

    // Function to handle unsaving an event
    const handleUnsaveEvent = async (eventId) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/events/${eventId}/unsave`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            // Remove the unsaved event from the list
            setAllPosts(prev => prev.filter(post => post.id !== eventId));
        } catch (error) {
            console.error('Error unsaving event:', error);
            alert('Failed to unsave event. Please try again.');
        }
    };

    if (error && !loading) {
        return (
            <div className="text-center py-5">
                <p>{error}</p>
                {error.includes('Authentication') ? (
                    <p>Please log in to view saved events.</p>
                ) : (
                    <button 
                        className="btn btn-primary mt-3"
                        onClick={fetchSavedEvents}
                    >
                        Try Again
                    </button>
                )}
            </div>
        );
    }

    return (
        <>
            {loading ? (
                <div className="row">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ShimmerCard key={i} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>Saved events ({allPosts.length})</h4>
                    </div>
                    <div className="row">
                        {visiblePosts.length > 0 ? (
                            visiblePosts.map(post => (
                                <div key={post.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mt-4">
                                    <div className="car shadow-s rounded h-100 blog-card border-0 position-relative">
                                        <div 
                                            className="heart-overlay-icon"
                                            onClick={() => handleUnsaveEvent(post.id)}
                                            style={{cursor: 'pointer'}}
                                            title="Unsave event"
                                        >
                                            <img src={heart_icon} alt="heart" />
                                        </div>
                                        <div 
                                            className="text-decoration-none text-dark"
                                            style={{cursor: 'pointer'}}
                                           
                                        >
                                            <img
                                                className="card-img-top poster_image"
                                                src={post.image}
                                                alt={post.title}
                                                loading="lazy"
                                                 onClick={() => handleCardClick(post)}
                                                onError={(e) => {
                                                    if (!e.target.dataset.fallback) {
                                                        e.target.src = 'https://placehold.co/300x200?text=Image+Not+Found';
                                                        e.target.dataset.fallback = true;
                                                    }
                                                }}
                                            />
                                            <div className='save-event-detail d-flex justify-content-between align-items-center w-100 pt-3 pb-0 pr-2 pl-2'>
                                                <div className="w-100">
                                                    <h6 className="event_titile"  > <span onClick={() => handleCardClick(post)}>{truncateText(post.title, 20)}</span></h6>
                                                    <Link to={'/profile/'+user.id} className="d-flex align-items-center osahan-post-header people-list">
                                                        <div className="dropdown-list-image  position-relative">
                                                            <img
                                                                className='organizer_image'
                                                                style={{ borderRadius: '50%', width: '30px', height: '30px', objectFit: 'cover' }}
                                                                src={post.authorAvatar}
                                                                alt={post.authorName}
                                                                onError={(e) => {
                                                                    if (!e.target.dataset.fallback) {
                                                                        e.target.src = 'https://placehold.co/50x50?text=No+Image';
                                                                        e.target.dataset.fallback = true;
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="font-weight-bolder" >
                                                            <p className="author_name ">{truncateText(post.authorName, 25)}</p>
                                                        </div>
                                                    </Link>
                                                    <small className="text-dark d-block font-weight-light mt-2">
                                                        {formatDateTime(post.eventDate, post.startTime)}
                                                    </small>
                                                    {/* {post.location && (
                                                        <small className="text-muted d-block mt-1">
                                                            {truncateText(post.location, 30)}
                                                        </small>
                                                    )} */}
                                                    {/* {post.price && post.price !== "0.00" && (
                                                        <div className="mt-2">
                                                            <span className="text-primary font-weight-bold">
                                                                ${post.price}
                                                            </span>
                                                        </div>
                                                    )} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <p>No saved events found.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
           
        </>
    );
}