import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../pageAssets/Navbar';
import cover_img from '../../assets/img/company-profile.jpg';
import friendImage from '../../assets/img/IMG_9488.jpeg';
import { FiEdit, FiBell, FiMoreHorizontal, FiCamera } from 'react-icons/fi';
import { FaGlobe, FaUserFriends, FaImages } from 'react-icons/fa';
import { IoMdPhotos } from 'react-icons/io';
import { RiVideoLine } from 'react-icons/ri';
import './MyProfilestyle.css';

function ProfileHeader() {
    const location = useLocation();
    
    // Function to determine if a nav link is active
    const isActive = (path) => {
        return location.pathname === path || 
               (path === '/myprofile' && location.pathname.startsWith('/myprofile'));
    };

    return (
        <div className="profile-wrapper">
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
                                            src={friendImage}
                                            alt="Profile"
                                        />
                                        <div className="profile-picture-action">
                                            <FiCamera />
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-details ">
                                    <h2 className="profile-name m-0">
                                        Yusuf Barnabas Tomilayo
                                    </h2>
                                    <p className="profile-username mb-2">@yusufbarnabas</p>

                                    <div className="profile-stats d-flex justify-content-center justify-content-md-start m-0 p-0">
                                        <div className="stat-item text-center">
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
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${isActive('/myprofile') ? 'active' : ''}`} 
                                        to="/myprofile"
                                    >
                                        Memes
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${isActive('/myprofile/mymemes') ? 'active' : ''}`} 
                                        to="/myprofile/mymemes"
                                    >
                                        Likes
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${isActive('/myprofile/savememes') ? 'active' : ''}`} 
                                        to="/myprofile/savememes"
                                    >
                                        Saved
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileHeader;