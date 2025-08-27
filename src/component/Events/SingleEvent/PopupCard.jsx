import React, { useState } from 'react';
import './eventSTyling.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../pages/auth/AuthContext';
import { showToast } from '../../ToastAlert';
import black_layers from '../../../assets/navbar_icons/black_layers.png';
import black_heart_icon from '../../../assets/navbar_icons/black_heart_icon.png';
import black_share_icon from '../../../assets/navbar_icons/black_share_icon.png';
import blck_add_user from '../../../assets/navbar_icons/blck_add_user.png';
import exclamation_circle from '../../../assets/navbar_icons/exclamation_circle.png';
export default function PopupCard({ post, onClose }) {
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    if (!post) return null;

    const truncateText = (text, max = 20) => {
        if (!text) return '';
        return text.length > max ? `${text.substring(0, max)}...` : text;
    };

    const handleToggleSave = async () => {
        if (!token) {
            alert("You must be logged in to save events.");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/events/${post.id}/toggle`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.status) {
                showToast.info(response.data.message);
            } else {
                showToast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error toggling event save:", error);
            showToast.error("Something went wrong while saving the event.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overlay-backdrop" onClick={onClose}>
            <div className="popup-card" onClick={(e) => e.stopPropagation()}>
                <div className='d-flex justify-content-center align-items-center'>
                    <div className="close-bt btn bg-light" onClick={onClose} style={{ height: '10px' }} ></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <div className='w-100'>
                        <div className="d-flex align-items-center pr-2 pl-2">
                            <div className="mr-3" style={{ position: 'relative' }}>
                                <img
                                    className="rounded-circle"
                                    src={post.authorAvatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                                    alt="Friend"
                                    style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="font-weight-bold" style={{ flex: '1' }}>
                                <div className='text-truncate'>{truncateText(post.hostName, 10) || 'Unknown Host'}</div>
                            </div>
                            <small style={{ color: 'rgba(143, 7, 231, 1)', fontSize: '10px' }}>More from organizer</small>
                        </div>
                        <ul className="list-unstyled event_pop_settings m-2 m">
                            <li className='border-bottom border-top'>
                                <span
                                    className="w-100 text-left d-flex align-items-center py-3"
                                    type="button"
                                >
                                    <img src={black_layers} alt="" />
                                    <Link  to={`/event/view/${post.id}`} >View Event Detail</Link>
                                </span>
                            </li>
                               <li className=''>
                                <span className="w-100 text-left d-flex align-items-center py-3" type="button">
                                    <img src={blck_add_user} alt="" />

                                    <span>Follow Organizer</span>
                                </span>
                            </li>
                            <li className='border-bottom border-top'>
                                <span
                                    className="w-100 text-left d-flex align-items-center py-3"
                                    type="button"
                                    onClick={handleToggleSave}
                                    style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
                                >
                                    <img src={black_heart_icon} alt="" />
                                    <span>{loading ? 'Processing...' : 'Save Post'}</span>
                                </span>
                            </li>
                         
                            <li className='border-bottom'>
                                <span className="w-100 text-left d-flex align-items-center py-3" type="span">
                                    <img src={black_share_icon} alt="" />
                                    <span>Share Event</span>
                                </span>
                            </li>
                            <li className='border-bottom'>
                                <span className="w-100 text-left d-flex align-items-center py-3" type="span" style={{ color: '#ed4956' }}>
                                    <img src={exclamation_circle} alt="" />
                                    <span>Report</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
