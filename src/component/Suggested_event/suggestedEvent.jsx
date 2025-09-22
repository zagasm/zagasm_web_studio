import React, { useState, useEffect, useRef, useCallback } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import heart_icon from '../../assets/navbar_icons/heart_icon.png';

function ImageWithLoader({ src, alt, fallbackSeed, size = 65, myEvent }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const fallbackAvatar = `https://picsum.photos/seed/${fallbackSeed}/${size}`;
    
    return (
        <div className="position-relative p-0 m-0" style={{ width: size, height: size }}>
            <img
                src={error ? fallbackAvatar : src}
                alt={alt}
                width={size}
                height={size}
                className={myEvent ? " my_organizer_image" : ""}
                onLoad={() => setLoaded(true)}
                onError={() => {
                    setError(true);
                    setLoaded(true);
                }}
                style={{
                    objectFit: 'cover',
                    display: loaded ? 'block' : 'none',
                    borderRadius: '3%'
                }}
            />
        </div>
    );
}

function SuggestedEvent({ myEvent, events, loading, loadingMore, error, hasMore, onLoadMore }) {
    const observer = useRef();
    const lastEventElementRef = useCallback(node => {
        if (loadingMore) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                onLoadMore();
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loadingMore, hasMore, onLoadMore]);

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short' 
        });
    };

    // Format time function
    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString;
    };

    if (loading && events.length === 0) {
        return (
            <div className="p-4 text-center">
                <Spinner animation="grow" variant="primary" />
                <p className="mt-2">Loading {myEvent ? 'My events' : 'Events'}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center">
                <p className="text-danger">Error: {error}</p>
                <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => onLoadMore()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!events || events.length === 0) {
        return (
            <div className="p-4 text-center">
                <p>No events found</p>
            </div>
        );
    }

    return (
        <div className={myEvent ? 'myEvent_container p-0 m-0' : "box shadow-s rounded bg-white mb-3 "}>
            {!myEvent && (
                <div className="box-title border-botto pb-3">
                    <h6 className="m-0 text-dark">Events for you...</h6>
                    {/* {events.length > 0 && (
                        <small className="text-muted">
                            Showing {events.length} events {hasMore ? '(scroll to load more)' : '(all events loaded)'}
                        </small>
                    )} */}
                </div>
            )}
            
            <div className={`box-body ${myEvent && `m-0 p-0`}`}>
                {events.map((event, index) => {
                    // Add ref to the last event element for infinite scroll
                    if (events.length === index + 1) {
                        return (
                            <div 
                                ref={lastEventElementRef}
                                className="d-flex align-items-center gap-5 osahan-post-header p-0 m-0 people-list" 
                                key={event.id || index}>
                                <div className="dropdown-list-imag position-relative m-0 p-0">
                                    <ImageWithLoader 
                                        src={event.poster?.[0]?.url || event.hostImage} 
                                        alt={event.title} 
                                        fallbackSeed={event.id || index}
                                        myEvent={myEvent} 
                                    />
                                </div>
                                <div className="font-weight-bold p-0 m-0 myevent_details flex-grow-1">
                                    <p className="text-truncate m-0 font-weight-bold">{event.title}</p>
                                    <div className="small text-gray-500 p-0">{event.hostName}</div>
                                    <div className="small text-gray-500 p-0">
                                        {formatDate(event.eventDate)} . {formatTime(event.startTime)}
                                    </div>
                                    <div className="small text-gray-500 p-0">{event.location}</div>
                                    <div className='font-weight-bold p-0 text-primary'>${event.price}</div>
                                </div>
                                <span className="ml-auto">
                                    <span className="fa fa-heart" style={{ fontSize: '20px', cursor: 'pointer', color: '#6c757d' }}> </span>
                                </span>
                            </div>
                        );
                    } else {
                        return (
                            <div 
                                className="d-flex align-items-center gap-5 osahan-post-header p-0 pb-3 people-list " 
                                key={event.id || index}
                            >
                                <div className="dropdown-list-imag position-relative m-0 p-0">
                                    <ImageWithLoader 
                                        src={event.poster?.[0]?.url || event.hostImage} 
                                        alt={event.title} 
                                        fallbackSeed={event.id || index}
                                        myEvent={myEvent} 
                                    />
                                </div>
                                <div className="font-weight-bold p-0 m-0 myevent_details flex-grow-1">
                                    <p className="text-truncate m-0 font-weight-bold">{event.title}</p>
                                    <div className="small text-gray-500 p-0">{event.hostName}</div>
                                    <div className="small text-gray-500 p-0">
                                        {formatDate(event.eventDate)} . {formatTime(event.startTime)}
                                    </div>
                                    <div className="small text-gray-500 p-0">{event.location}</div>
                                    <div className='font-weight-bold p-0 '>${event.price}</div>
                                </div>
                                <span className="ml-auto">
                                    <span className="fa fa-heart" style={{ fontSize: '20px', cursor: 'pointer', color: '#6c757d' }}> </span>
                                </span>
                            </div>
                        );
                    }
                })}
            </div>

            {/* Loading spinner for infinite scroll */}
            {loadingMore && (
                <div className="text-center p-3">
                    <Spinner animation="border" size="sm" variant="primary" />
                    <p className="mt-2 small text-muted">Loading more events...</p>
                </div>
            )}

            {/* No more events message */}
            {/* {!hasMore && events.length > 0 && (
                <div className="text-center p-3 border-top">
                    <p className="small text-muted m-0">All events loaded</p>
                </div>
            )} */}
        </div>
    );
}

export default SuggestedEvent;