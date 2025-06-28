import React, { useEffect, useState } from 'react';
import SideBarNav from '../pageAssets/sideBarNav';
import RightBarComponent from '../pageAssets/rightNav';
import SuggestedFriends from '../../component/Friends/suggestedFriends';
import { Heart, UserPlus, MessageCircle, AtSign, MoreVertical, Trash2, X } from 'react-feather';
import './NotificationStyle.css';

function Notifications() {
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'like',
            user: 'travel_lover',
            userPic: 'https://randomuser.me/api/portraits/women/44.jpg',
            postPreview: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
            time: '5 min ago',
            read: false
        },
        {
            id: 2,
            type: 'follow',
            user: 'foodie_adventures',
            userPic: 'https://randomuser.me/api/portraits/men/32.jpg',
            time: '1 hour ago',
            read: false
        },
        {
            id: 3,
            type: 'comment',
            user: 'photography_pro',
            userPic: 'https://randomuser.me/api/portraits/women/68.jpg',
            postPreview: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
            comment: 'This is amazing! Where was this taken?',
            time: '3 hours ago',
            read: true
        },
        {
            id: 4,
            type: 'mention',
            user: 'fitness_guru',
            userPic: 'https://randomuser.me/api/portraits/men/75.jpg',
            postPreview: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
            time: '1 day ago',
            read: true
        },
        {
            id: 5,
            type: 'like',
            user: 'art_enthusiast',
            userPic: 'https://randomuser.me/api/portraits/women/25.jpg',
            postPreview: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
            time: '2 days ago',
            read: true
        }
    ]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const getNotificationIcon = (type) => {
        switch(type) {
            case 'like': return <Heart size={18} color="#8000FF" />;
            case 'follow': return <UserPlus size={18} color="#8000FF" />;
            case 'comment': return <MessageCircle size={18} color="#8000FF" />;
            case 'mention': return <AtSign size={18} color="#8000FF" />;
            default: return null;
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => 
            n.id === id ? {...n, read: true} : n
        ));
    };

    return (
        <div className="notifications-page">
            <SideBarNav />
            <div className="container-fluid p-0">
                <div className=" offset-xl-3 offset-lg-1 offset-md-1">
                    <main className="col col-xl-7 col-lg-6 col-md-12 col-sm-12 col-12 main-container" style={{paddingTop:'80px'}}>
                        <div className="notification-card">
                            <div className="notification-header">
                                <h2>Notifications</h2>
                                <button className="mark-all-read">Mark all as read</button>
                            </div>
                            
                            {loading ? (
                                <div className="shimmer-container">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="shimmer-notification">
                                            <div className="shimmer-avatar"></div>
                                            <div className="shimmer-content">
                                                <div className="shimmer-line"></div>
                                                <div className="shimmer-line short"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="notification-list">
                                    {notifications.map(notification => (
                                        <div 
                                            key={notification.id} 
                                            className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                           
                                            <div className="user-avatar">
                                                <img src={notification.userPic} alt={notification.user} />
                                            </div>
                                            <div className="notification-content">
                                                <p>
                                                    <strong>{notification.user}</strong> 
                                                    {notification.type === 'like' && ' liked your post'}
                                                    {notification.type === 'follow' && ' started following you'}
                                                    {notification.type === 'comment' && ` commented: "${notification.comment}"`}
                                                    {notification.type === 'mention' && ' mentioned you in a post'}
                                                </p>
                                                <span className="time">{notification.time}</span>
                                            </div>
                                            {notification.postPreview && (
                                                <div className="post-preview">
                                                    <img src={notification.postPreview} alt="Post preview" />
                                                </div>
                                            )}
                                            <div className="notification-actions">
                                                <MoreVertical size={18} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>

                    <RightBarComponent>
                        <SuggestedFriends />
                    </RightBarComponent>
                </div>
            </div>
        </div>
    );
}

export default Notifications;