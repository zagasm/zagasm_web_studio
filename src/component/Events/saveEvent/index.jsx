import React, { useEffect, useState } from 'react';
import './SavedeventSTyling.css';
import heart_icon from '../../../assets/navbar_icons/heart_icon.png';
import { useAuth } from '../../../pages/auth/AuthContext';
import axios from 'axios';

// Simple shimmer loader
const ShimmerCard = () => (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
        <div className="shimmer-card rounded h-100">
            <div className="shimmer-img"></div>
            <div className="shimmer-line"></div>
            <div className="shimmer-line short"></div>
        </div>
    </div>
);

export default function SaveEventTemplate() {
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const postsPerPage = 80000;
    const { token } = useAuth();

    useEffect(() => {
        fetchSavedEvents();
    }, []);

    useEffect(() => {
        if (allPosts.length > 0) {
            loadPosts(1);
        }
    }, [allPosts]);

    const formatDateTime = (dateStr, timeStr) => {
        try {
            const date = new Date(`${dateStr} ${timeStr}`);
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'long'
            });
            const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            return `${formattedDate} · ${formattedTime}`;
        } catch {
            return `${dateStr} · ${timeStr}`;
        }
    };

    const fetchSavedEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/events/saved/list`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data?.status && Array.isArray(res.data.data)) {
                const mappedPosts = res.data.data.map(event => ({
                    id: event.id,
                    image: event.hostImage || 'https://placehold.co/300x200?text=No+Image',
                    title: event.title || 'Untitled Event',
                    authorAvatar: event.hostImage || 'https://placehold.co/50x50?text=No+Image',
                    authorName: event.hostName || 'Unknown Host',
                    price: event.price || 0,
                    eventDate: event.eventDate || '',
                    startTime: event.startTime || '',
                }));
                setAllPosts(mappedPosts);
            }
        } catch (error) {
            console.error('Error fetching saved events:', error);
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

    return (
        <>
            {loading ? (
                Array.from({ length: 8 }).map((_, i) => <ShimmerCard key={i} />)
            ) : (
                visiblePosts.map(post => (
                    <div key={post.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mt-4">
                        <div className="car shadow-s rounded h-100 blog-card border-0 position-relative">
                            <div className="heart-overlay-icon">
                                <img src={heart_icon} alt="heart" />
                            </div>
                            <a href="#" className="text-decoration-none text-dark">
                                <img
                                    className="card-img-top"
                                    src={post.image}
                                    alt={post.title}
                                    loading="lazy"
                                    onError={(e) => {
                                        if (!e.target.dataset.fallback) {
                                            e.target.src = 'https://placehold.co/300x200?text=Image+Not+Found';
                                            e.target.dataset.fallback = true;
                                        }
                                    }}
                                />
                                <div className='save-event-detail d-flex justify-content-between align-items-center w-100 pt-3 pb-0 pr-2 pl-2'>
                                    <div>
                                        <h6 className=" event_titile">{truncateText(post.title, 20)}</h6>
                                        <div className="d-flex align-items-center osahan-post-header people-list" key={post.id}>
                                            <div className="dropdown-list-image mr-2 position-relative">
                                                <img
                                                    className='organizer_image'
                                                    style={{ borderRadius: '50%' }}
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
                                            <div className="font-weight-bold mt-2">
                                                <p className="author_name">{truncateText(post.authorName, 25)}</p>
                                            </div>
                                        </div>
                                        <small className="text-muted">
                                            {formatDateTime(post.eventDate, post.startTime)}
                                        </small>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                ))
            )}
            {selectedPost && <PopupCard post={selectedPost} onClose={() => setSelectedPost(null)} />}
        </>
    );
}
