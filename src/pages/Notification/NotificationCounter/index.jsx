import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell } from 'react-feather';
import './NotificationCounter.css';

const NotificationCounter = ({ userId, pollingInterval = 10000 }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        const formData = new FormData();
        formData.append('api_secret_key', 'Zagasm2025!Api_Key_Secret');
        formData.append('user_id', userId);
        formData.append('offset', '0');

        try {
            const response = await axios.post('http://zagasm.com/includes/ajax/notifications/get_notifications.php', formData);
            if (response.data.success && Array.isArray(response.data.notifications)) {
                const unread = response.data.notifications.filter(n => n.seen === '0').length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Failed to fetch unread notification count:', error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, pollingInterval);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {unreadCount > 0 ? (
                <span className='notification-badge'>
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            ) : '0'}
        </>
    );
};

export default NotificationCounter;
