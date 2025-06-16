// import React from 'react';
import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Navbar from '../pageAssets/Navbar';
import cover_img from '../../assets/img/company-profile.jpg';
import default_profilePicture from '../../assets/avater_pix.avif';
import { FiEdit, FiBell, FiMoreHorizontal, FiCamera } from 'react-icons/fi';

import './MyProfilestyle.css';
import ShimmerLoader from '../../component/assets/Loader/profileHeaderLoader';
import { useAuth } from "../auth/AuthContext";

function ProfileHeader() {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const {user} = useAuth();
    console.log('User details',user.user_picture);
    
    const Default_user_image = user.user_picture || default_profilePicture; 
    // Function to determine if a nav link is active
    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            // Normally you'd fetch from API here and set the result
            setIsLoading(false);
        }, 2000); // 2 seconds simulated loading
    }, []);
    return (
        <div>
            {isLoading ? <ShimmerLoader /> : <div className="profile-wrapper">
                {/* Navbar */}
                <Navbar />

                {/* Cover Photo Section */}
                <div className="cover-photo-container">
                    <div
                        className="cover-photo"
                        style={{
                            background: "linear-gradient(to right, #8000FF, rgba(228, 40, 235, 0.87))",
                            marginTop: '65px',
                            height: '200px',
                            position: 'relative'
                        }}
                    >
                        <div className="cover-photo-actions">
                            <button className="cover-action-btn">
                                <FiCamera className="mr-1" />
                                Update Cover Photo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Info Section */}
                <div className="profile-info-section bg-white shadow-sm">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="profile-header d-flex flex-column flex-md-row align-items-center py-3">
                                    <div className="profile-picture-container mb-3 mb-md-0 mx-auto mx-md-0">
                                        <div className="profile-picture-wrapper">
                                            <img
                                                className="profile-picture"
                                                src={Default_user_image}
                                                alt="Profile"
                                            />
                                            <div className="profile-picture-action">
                                                <FiCamera />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="profile-details ">
                                        <h2 className="profile-name m-0">
                                            {user.user_lastname} {user.user_firstname}
                                        </h2>
                                        <p className="profile-username mb-2">@{user.user_name}</p>

                                        <div className="profile-stats d-flex justify-content-center justify-content-md-start m-0 p-0 ">
                                            <div className="stat-item text-center p-0  ">
                                                <span className='fa fa-image profile_icon'></span>
                                                <div>
                                                    <span className="stat-number">1,234</span>
                                                    <span className="stat-label">Post</span>
                                                </div>
                                            </div>

                                            <div className="stat-item text-center">
                                                <span className='fa fa-users profile_icon'></span>
                                                <div>
                                                    <span className="stat-number">789</span>
                                                    <span className="stat-label">Followers</span>
                                                </div>
                                            </div>
                                            <div className="stat-item text-center">
                                                <span className='fa fa-user-plus profile_icon'></span>
                                                <div>
                                                    <span className="stat-number">789</span>
                                                    <span className="stat-label">Following</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="profile-actions mt-3 mt-md-0 ml-md-auto text-center">
                                        <button className="btn mr-2 mb-2 mb-md-0">
                                            <FiEdit className="mr-1" />
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Navigation */}
                <div className="profile-navigation bg-white border-bottom">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <ul className="nav nav-tabs profile-nav">
                                    <NavLink
                                        to="/myprofile"
                                        end
                                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    >
                                        Memes
                                    </NavLink>

                                    <NavLink
                                        to="/myprofile/mymemes"
                                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    >
                                        Likes
                                    </NavLink>

                                    <NavLink
                                        to="/myprofile/savedmemes"
                                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    >
                                        Saved
                                    </NavLink>


                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default ProfileHeader;