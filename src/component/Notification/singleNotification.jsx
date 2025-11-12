import React, { useEffect, useState } from 'react';
import './singleNotification.css';

/**
 * Props:
 * - notification: {
 *     id, message, data, read_at, read_at_human, created_at, time_ago
 *   }
 * - onClick: () => void   // mark as read (container click)
 * - onDelete: () => void  // opens confirm modal
 */
function SingleNotificationTemplate({ notification, onClick, onDelete }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Prefer actionable text from data.action; else stringify message
  const fullText = notification?.data?.action
    || (notification?.message ? JSON.stringify(notification.message) : 'Notification');

  const previewText = fullText.length > 100 ? (fullText.substring(0, 100) + '…') : fullText;

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const isUnread = !notification?.read_at;

  return (
    <div
      className="noty_container shadow-sm p-2 mb-3"
      onClick={onClick}
      role="button"
      style={{
        cursor: 'pointer',
        // small visual hint for unread without tailwind restyle:
        borderLeft: isUnread ? '3px solid #8F07E7' : '3px solid transparent'
      }}
    >
      <div className="d-flex align-items-center osahan-post-header noty_info">
        {/* Removed random user image as requested */}
        <div className="font-weight-bold w-100">
          {/* Top line: a simple title from message.reference if present */}
          {notification?.message?.reference && (
            <div className="mb-1">
              <b>{notification.message.reference}</b>
            </div>
          )}

          <p className="mb-1">
            <small>
              {isMobile && !isExpanded ? previewText : fullText}
              {isMobile && fullText.length > 100 && (
                <button
                  onClick={toggleExpand}
                  className="read-more-btn"
                  style={{ border: 'none', background: 'transparent', color: '#8F07E7' }}
                >
                  {isExpanded ? ' Read Less' : ' Read More'}
                </button>
              )}
            </small>
          </p>

          {/* Meta row: time + unread dot + delete icon */}
          <ul className="right_interval_indicator pb-1 d-flex align-items-center">
            <li><span>{notification?.time_ago || notification?.created_at}</span></li>
            <li className='indicator' />
            {/* delete button */}
            <li className="ms-auto">
              <button
                type="button"
                aria-label="Delete notification"
                onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                className="btn btn-sm btn-link text-danger p-0"
                title="Delete"
              >
                &#10005;
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SingleNotificationTemplate;
