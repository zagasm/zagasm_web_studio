import React, { useEffect, useState } from 'react';
import './eventSTyling.css';
import threeDot from '../../../assets/navbar_icons/threeDot.png';
import camera_icon from '../../../assets/navbar_icons/camera_icon.png';
import live_indicator from '../../../assets/navbar_icons/live_indicator.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../pages/auth/AuthContext';
import PopupCard from './PopupCard';

// Popup Card component


export default function EventTemplate({ live }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageLoaded, setImageLoaded] = useState({});
    const [brokenImages, setBrokenImages] = useState({});
    const { user, token } = useAuth();
    // const token = user.token;
    console.log('checking');

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/events`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEvents(response.data.events);
            const loadedMap = {};
            response.data.events.forEach(event => {
                loadedMap[event.id] = false;
            });
            setImageLoaded(loadedMap);
            setBrokenImages({});
        } catch (err) {
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || !token) return;
        fetchEvents();
    }, [user]);



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
            {events.map(event => (
                <div key={event.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
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
                                {/* {!imageLoaded[event.id] && (
                                    <div className="image-placeholder" style={{
                                        position: 'absolute', top: 0, left: 0,
                                        width: '100%', height: '100%',
                                        backgroundColor: '#f5f5f5',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )} */}

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
                                        // visibility: imageLoaded[event.id] ? 'visible' : 'hidden'
                                    }}
                                // onLoad={() => handleImageLoad(event.id)}
                                // onError={() => handleImageError(event.id)}
                                />
                            </div>

                            <div className='d-flex justify-content-between align-items-center w-100 pt-2 pb-0 pr-2 pl-2'>
                                <div className='bg-da' style={{ width: '65%' }}>
                                    <h6 className="pt-2 mr-5 event_title" style={{ lineHeight: '20px' }}><b>{truncateText(event.title, 20)}</b></h6>
                                    <small className="event_time text-muted text-truncat" >
                                        {truncateText(formatDate(event.eventDate), 23)}
                                        {/* {truncateText(event.startTime, 8)} · {truncateText(event.location, 12) */}
                                    </small>
                                </div>
                                <div cls style={{ width: '35%', textAlign: 'right' }}>
                                    <h6 className="event_price ">
                                        ${event.price ? event.price.toFixed(2) : '0.00'}
                                    </h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            ))}

            {selectedEvent && <PopupCard post={selectedEvent} onClose={() => setSelectedEvent(null)} />}

            {loading && (
                <div className="text-center mt-3">
                    <span>Loading events...</span>
                </div>
            )}

            {!loading && events.length === 0 && (
                <div className="text-center mt-3">
                    <span>No events available</span>
                </div>
            )}
        </>
    );
}
