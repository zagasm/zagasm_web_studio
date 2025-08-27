import React, { useState } from 'react';
import SideBarNav from '../../pageAssets/sideBarNav';
import { Link } from 'react-router-dom';
import './manageNotificationStyling.css';

function AccountNotification() {
    const [notifications, setNotifications] = useState({
        likedEvents: false,
        manageNotification: false
    });

    const toggleSwitch = (name) => {
        setNotifications(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    return (
        <div className="container-flui m-0 p-0">
            <SideBarNav />
            <div className="page_wrapper overflow-hidden">
                <div className="row p-0">
                    <div className="col account_section">
                        <div>
                            <h3 className='ml-2'>Manage Notification</h3>
                            <div className="account_nav_section">
                                <div>
                                    <div className="row">
                                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 ">
                                            <div className="internal_notification_container">
                                                <h6>Activity</h6>
                                                <ul>
                                                    <li>
                                                        <span className='account_link'>
                                                            <div>
                                                                <span>Events you liked</span>
                                                            </div>
                                                            <div className="switch-container">
                                                                <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span className='account_link'>
                                                            <div>
                                                                <span>Organizer you follow</span>
                                                            </div>
                                                            <div className="switch-container">
                                                                <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span className='account_link'>
                                                            <div>
                                                                <span>Reminders</span>
                                                            </div>
                                                            <div className="switch-container">
                                                                <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span className='account_link'>
                                                            <div>
                                                                <span>Requests for event feedback</span>
                                                            </div>
                                                            <div className="switch-container">
                                                                <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                                            <div className="internal_notification_container">
                                                <h6>Help</h6>
                                                <ul>
                                                    <li>
                                                        <span to={""} className='account_link'>
                                                            <div>
                                                                <span>Manage notification</span>
                                                            </div>
                                                            <div className="switch-container">
                                                                <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span to={""} className='account_link'>
                                                            <div>
                                                                <span>Newsletter</span>
                                                            </div>
                                                            <div className="switch-container">
                                                                <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span to={""} className='account_link'>
                                                            <div>
                                                                <span>Followed Organizers</span>
                                                            </div>
                                                            <div className="switch-container">
                                                                <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </span>
                                                    </li>
                                                     <li>
                                                        <span to={""} className='account_link'>
                                                            <div>
                                                                <span>Reminders</span>
                                                            </div>
                                                            <div className="switch-container">
                                                                <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </span>
                                                    </li>
                                                       <li>
                                                        <span className='account_link'>
                                                            <div>
                                                                <span>Requests for event feedback</span>
                                                            </div>
                                                            <div className="switch-container">
                                                                <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </span>
                                                    </li>
                                                       <li>
                                                        <span className='account_link'>
                                                            <div>
                                                                <span>Liked events</span>
                                                            </div>
                                                            <div className="switch-container">
                                                                <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountNotification;