import React, { useState } from 'react';
// import SideBarNav from '../pageAssets/sideBarNav.jsx';
import SideBarNav from "../pageAssets/SideBarNav";
import live_camera from '../../assets/navbar_icons/solar_stream-broken.svg';
import './Homestyle.css';
import RightBarComponent from '../../component/RightBarComponent';
import EventTemplate from '../../component/Events/SingleEvent';
import SuggestedOrganizer from '../../component/Suggested_organizer/suggestedOrganizer';
import MobileSingleOrganizers from '../../component/Organizers/ForMobile';
import { Link } from 'react-router-dom';

function Home() {
    const [activeTab, setActiveTab] = useState('ForYou');
    return (
        <div className="container-flui m-0 p-0">
            <SideBarNav />
            <div className="page_wrapper overflow-hidden ">
                <div className="row p-0 ">
                    <div className="col ">
                        <div className="shadow-s mb-3 p-0">
                            <div className="heading_tab_container">
                                <button
                                    className={`tab ${activeTab === 'ForYou' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('ForYou')}
                                >
                                    For You
                                </button>
                                <button
                                    className={`tab ${activeTab === 'Live' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('Live')}
                                    style={{ color: "red" }}
                                >
                                    Live <img src={live_camera} alt="" />
                                </button>

                            </div>
                        </div>

                        <div className="posts-containe ">
                           
                                <div className="col mobile_organizer">
                                    <div className="d-flex justify-content-between p-1">
                                        <small><b>Organizers you may know</b></small>
                                        <Link to={'/organizers'}>view all</Link>
                                    </div>
                                    <MobileSingleOrganizers />
                                </div>
                            {activeTab === 'ForYou' ? (
                                <div className="row">
                                    <EventTemplate />
                                </div>
                            ) : (
                                <div className="row">
                                    <EventTemplate live={true} />
                                </div>

                            )}
                        </div>
                    </div>
                    <RightBarComponent>
                        <SuggestedOrganizer />
                    </RightBarComponent>
                </div>
            </div>
        </div>
    );
}

export default Home;