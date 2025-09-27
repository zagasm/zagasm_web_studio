import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './viewProfileSTyling.css';
import { useAuth } from '../../auth/AuthContext';
import default_profilePicture from '../../../assets/avater_pix.avif';
import SideBarNav from '../../pageAssets/SideBarNav';
import Group from '../../../assets/navbar_icons/Group.svg';
import SuggestedEvent from '../../../component/Suggested_event/suggestedEvent';

function ViewProfile() {
    const { user, logout, token } = useAuth();
    const [activeTab, setActiveTab] = useState('myEvents');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const Default_user_image = user?.profileUrl ? user.profileUrl : default_profilePicture;

    // Fetch events data
    useEffect(() => {
        const fetchEvents = async () => {
            if (!token) return;
            
            try {
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/events`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch events');
                }

                const data = await res.json();
                if (data.status) {
                    setEvents(data.message || []);
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching events:', err);
            } finally {
                setLoading(false);
            }
        };

        if (activeTab === 'myEvents') {
            fetchEvents();
        }
    }, [token, activeTab]);

    return (
        <div className="container-fluid m-0 p-0">
            <SideBarNav />
            <div className="page_wrapper overflow-hidden">
                <div className="row p-0">
                    <div className="col account_section">
                        <div className="row">
                            <div className="col-xl-3 col-lg-5 col-md-5 col-sm-12 col-12 p-0 m-0">
                                <div className="heading_section bg-dange shadow-l pt-3 pb-3">
                                    <div className="details_display">
                                        <div className='profle_img'>
                                            <img
                                                className=""
                                                src={Default_user_image}
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className='profile_info '>
                                            <div>
                                                <small><b>Username</b></small> <br />
                                                <small>Artist</small>
                                                <div className='follower_following_section'>
                                                    <p className='follow_section'><small> <span>12</span> following</small> <small> <span>302</span> followers</small></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="viewers_section">
                                            <div className="NoEvent">
                                                <h6 className='m-0 p-0'> {events.length} events</h6>
                                            </div>
                                            <div className="organizers_views border-rounded">
                                                <div className="d-flex align-items-center  job-item-body">
                                                    <div className="overlap-rounded-circle">
                                                        <img
                                                            className="rounded-circle shadow-sm user_template_im"
                                                            src={Default_user_image}
                                                        /> <img
                                                            className="rounded-circle shadow-sm user_template_im"
                                                            src={Default_user_image}
                                                        /> <img
                                                            className="rounded-circle shadow-sm user_template_im"
                                                            src={Default_user_image}
                                                        />
                                                    </div>
                                                    <span className="font-weight-lighter">200k viewers</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='create_event_btn'>
                                            <Link to={'/event/select-event-type'}><img src={Group} /> Create Event</Link>
                                        </div>
                                        <div className='eventAttendedSection'>
                                            <p className='NoEventAttended'><span>0</span> <small>Event attended</small></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-9 col-lg-7 col-md-7 col-sm-12 col-12 p-0 m-0">
                                <div className="tab_section_container">
                                    <div className="tab_section_internal_container ">
                                        <div className="tabs_navigation d-flex">
                                            <button
                                                className={`tab_button ${activeTab === 'myEvents' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('myEvents')}
                                            >
                                                My Events
                                            </button>
                                            <button
                                                className={`tab_button ${activeTab === 'aboutMe' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('aboutMe')}
                                            >
                                                About Me
                                            </button>
                                        </div>

                                        <div className="myprofile_tab_content">
                                            {activeTab === 'myEvents' && (
                                                <div className="tab-my-event">
                                                    <SuggestedEvent 
                                                        myEvent={true} 
                                                        events={events}
                                                        loading={loading}
                                                        error={error}
                                                    />
                                                </div>
                                            )}
                                            {activeTab === 'aboutMe' && (
                                                <div className="tab-aboutme">
                                                    <p>Lorem ipsum dolor sit amet consectetur...</p>
                                                </div>
                                            )}
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

export default ViewProfile;