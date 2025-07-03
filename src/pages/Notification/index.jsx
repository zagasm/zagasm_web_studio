// Full React Notifications Component with:
// - Real-time API integration
// - Pagination (infinite scroll with offset)
// - Delete Notification
// - Profile info resolution via get_profile.php
// - Sound/vibration feedback

import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import SideBarNav from '../pageAssets/sideBarNav';
import RightBarComponent from '../pageAssets/rightNav';
import SuggestedFriends from '../../component/Friends/suggestedFriends';
import { Heart, UserPlus, MessageCircle, AtSign, MoreVertical, Trash2 } from 'react-feather';
import './NotificationStyle.css';
import { useAuth } from '../auth/AuthContext';

const API_KEY = 'Zagasm2025!Api_Key_Secret';
const DEFAULT_AVATAR = 'https://zagasm.com/content/themes/default/images/blank_profile.png';
const SOUND_FILE = '/sounds/notification.mp3'; // Add your own sound file path

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const {user}  = useAuth();
  const userId = user.user_id;
  const viewerId = user.user_id;

  const playSound = () => {
    const audio = new Audio(SOUND_FILE);
    audio.play();
    if (navigator.vibrate) navigator.vibrate(100);
  };

  const fetchUserProfile = async (profile_id) => {
    const formData = new FormData();
    formData.append('api_secret_key', API_KEY);
    formData.append('profile_id', profile_id);
    formData.append('viewer_id', viewerId);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/includes/ajax/users/get_profile.php`, formData);
      if (res.data.success) {
        const profile = res.data.profile;
        return {
          userName: profile.user_name || `user_${profile_id}`,
          avatar: profile.user_picture
            ? `${import.meta.env.VITE_API_URL}/content/uploads/${profile.user_picture}`
            : DEFAULT_AVATAR
        };
      }
    } catch (err) {
      return { userName: `user_${profile_id}`, avatar: DEFAULT_AVATAR };
    }
  };

  const fetchNotifications = async () => {
    if (!hasMore) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('api_secret_key', API_KEY);
    formData.append('user_id', userId);
    formData.append('offset', offset);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/includes/ajax/notifications/get_notifications.php`, formData);
      if (response.data.success && response.data.notifications.length > 0) {
        const enriched = await Promise.all(
          response.data.notifications.map(async (n) => {
            const profile = await fetchUserProfile(n.from_user_id);
            return {
              id: n.notification_id,
              type: n.action === 'follow' ? 'follow' : 'comment',
              user: profile.userName,
              userPic: profile.avatar,
              comment: n.message || '',
              time: n.time,
              read: n.seen === '1'
            };
          })
        );
        setNotifications((prev) => [...prev, ...enriched]);
        setOffset((prev) => prev + 10);
        playSound();
        if (response.data.notifications.length < 10) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const lastNotificationRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchNotifications();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="notifications-page">
      <SideBarNav />
      <div className="container-fluid p-0">
        <div className="offset-xl-3 offset-lg-1 offset-md-1">
          <main className="col col-xl-7 col-lg-6 col-md-12 col-sm-12 col-12 main-container" style={{ paddingTop: '80px' }}>
            <div className="notification-card">
              <div className="notification-header">
                <h2>Notifications</h2>
                <button className="mark-all-read" onClick={() => setNotifications(n => n.map(item => ({ ...item, read: true })))}>
                  Mark all as read
                </button>
              </div>

              <div className="notification-list">
                {notifications.map((notification, i) => (
                  <div
                    ref={i === notifications.length - 1 ? lastNotificationRef : null}
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
                        {notification.type === 'follow' && ' started following you'}
                        {notification.type === 'comment' && ` sent: "${notification.comment}"`}
                      </p>
                      <span className="time">{notification.time}</span>
                    </div>
                    <div className="notification-actions">
                      <Trash2 size={18} onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }} style={{ cursor: 'pointer' }} />
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="shimmer-container">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="shimmer-notification">
                        <div className="shimmer-avatar"></div>
                        <div className="shimmer-content">
                          <div className="shimmer-line"></div>
                          <div className="shimmer-line short"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
