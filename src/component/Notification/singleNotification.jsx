import React, { useState, useEffect } from 'react';
import './singleNotification.css';

function SingleNotificationTemplate() {
    const [isMobile, setIsMobile] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const fullText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et architecto quae laborum ipsum cum voluptatem ducimus autem quibusdam, nam blanditiis accusantium aperiam repudiandae sequi est quo tenetur omnis laboriosam ratione.";
    const previewText = fullText.substring(0, 100) + '...';

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Check on mount
        checkIfMobile();

        // Add event listener for window resize
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="noty_container shadow-sm p-2 mb-3">
            <div className="d-flex align-items-center osahan-post-header noty_info">
                <div className="dropdown-list-image mr-2 position-relativ">
                    <img 
                        className='organizer_image' 
                        style={{ borderRadius: '50%' }} 
                        src={'https://randomuser.me/api/portraits/men/28.jpg'} 
                        alt="Profile" 
                    />
                </div>
                <div className="font-weight-bold">
                    <b>Kevin Bae</b>
                    <p>
                        <small>
                            {isMobile && !isExpanded ? previewText : fullText}
                            {isMobile && (
                                <button 
                                    onClick={toggleExpand}
                                    className="read-more-btn"
                                >
                                    {isExpanded ? ' Read Less' : ' Read More'}
                                </button>
                            )}
                        </small>
                    </p>
                </div>
            </div>
            <ul className="right_interval_indicator pb-1">
                <li><span>Dec 12, 2025</span></li>
                <li className='indicator'></li>
            </ul>
        </div>
    );
}

export default SingleNotificationTemplate;