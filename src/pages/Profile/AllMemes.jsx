import React from 'react';
import Navbar from '../pageAssets/Navbar';
import cover_img from '../../assets/img/company-profile.jpg';
import friendImage from '../../assets/img/IMG_9488.jpeg';
import { FiEdit, FiBell, FiMoreHorizontal, FiCamera } from 'react-icons/fi';
import { FaFacebookF, FaGlobe, FaUserFriends, FaImages } from 'react-icons/fa';
import { IoMdPhotos } from 'react-icons/io';
import { RiVideoLine } from 'react-icons/ri';
import imgTomilayo from '../../assets/img/IMG_9488.jpeg';
import postImg1 from '../../assets/img/post1.png';
import './MyProfilestyle.css';

function MyMemes() {
    return (
        <div className="profile-content container mt-4">
            <div className="row">
                {/* Left Sidebar */}
                <div className="col-xl-4 col-md-4 d-none ">
                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Intro</h5>
                            <p className="card-text">This is a sample bio. You can write something about yourself here.</p>
                            <div className="intro-details">
                                {/* <div className="detail-item">
                                        <FaGlobe className="mr-2" />
                                        <span>www.example.com</span>
                                    </div> */}
                                <div className="detail-item">
                                    {/* <FaFacebookF className="mr-2" /> */}
                                    <span>Joined September 2023</span>
                                </div>
                            </div>
                            <button className="btn btn-outline-secondary btn-block mt-2">
                                Edit Details
                            </button>
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Photos</h5>
                            <div className="photos-grid">
                                <div className="photo-item">
                                    <img src={friendImage} alt="Photo" />
                                </div>
                                <div className="photo-item">
                                    <img src={cover_img} alt="Photo" />
                                </div>
                                <div className="photo-item">
                                    <img src={friendImage} alt="Photo" />
                                </div>
                                <div className="photo-item">
                                    <img src={cover_img} alt="Photo" />
                                </div>
                                <div className="photo-item">
                                    <img src={friendImage} alt="Photo" />
                                </div>
                                <div className="photo-item">
                                    <img src={cover_img} alt="Photo" />
                                </div>
                            </div>
                            <button className="btn btn-outline-secondary btn-block mt-2">
                                See All Photos
                            </button>
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Friends</h5>
                            <p className="card-text">1,234 friends</p>
                            <div className="friends-grid">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div className="friend-item" key={item}>
                                        <img src={friendImage} alt="Friend" />
                                        <span>Friend {item}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-outline-secondary btn-block mt-2">
                                See All Friends
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Feed */}
                <div className="col-xl-12  col-md-8 col-sm-12 " style={{ paddingBottom: '200px' }}>
                    {/* Create Post */}

                    <div className="row">
                        {/* Post 1 */}
                        <div className="col-xl-6 col-lg- col-md-6 col-12">


                            <div className=" box shadow-l border rounded bg-white mb-3 osahan-post car">
                                <div className="p-3 d-flex align-items-center border-bottom osahan-post-header">
                                    <div className="dropdown-list-image mr-3">
                                        <img className="rounded-circle" src={imgTomilayo} alt="Tomilayo Barnabas" />
                                        <div className="status-indicator bg-success"></div>
                                    </div>
                                    <div className="font-weight-bold">
                                        <div className="text-truncate">Tomilayo Barnabas</div>
                                        <div className="small text-gray-500">3 hours</div>
                                    </div>
                                    <span className="ml-auto small">
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="feather-more-vertical"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <button className="dropdown-item" type="button"><i className="feather-trash"></i> Delete</button>
                                                <button className="dropdown-item" type="button"><i className="feather-x-circle"></i> Turn Off</button>
                                            </div>
                                        </div>
                                    </span>
                                </div>
                                <div className="p-3 border-bottom osahan-post-body">
                                    <p className="mb-0 p-4" style={{ background: '#8000FF', color: 'white', }}>
                                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi iure saepe rem non corrupti quas.
                                        Repellendus maxime voluptate eius, porro consequatur, sed possimus facere veniam ratione esse
                                        reprehenderit dolores! Repellendus. <a href="#">laboris consequat.</a>
                                    </p>
                                </div>
                                <div className="p-3 border-botto osahan-post-footer d-flex justify-between text-center w-100 overflow-hidden row post_icon_container">
                                    <a href="#" className="text-secondary col"><i className="feather-share-2"></i> 2</a>
                                    <a href="#" className="text-secondary col"><i className="feather-message-square"></i> 8</a>
                                    <a href="#" className="text-secondary col"><i className="feather-eye "></i> 16</a>
                                    <a href="#" className="text-secondary col"><i className="feather-hear ">😍7</i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg- col-md-6 col-12">
                            <div className=" mr-2 box shadow-l border rounded bg-white mb-3 osahan-post car">
                                <div className="p-3 d-flex align-items-center border-bottom osahan-post-header">
                                    <div className="dropdown-list-image mr-3">
                                        <img className="rounded-circle" src={imgTomilayo} alt="Tomilayo Barnabas" />
                                        <div className="status-indicator bg-success"></div>
                                    </div>
                                    <div className="font-weight-bold">
                                        <div className="text-truncate">Tomilayo Barnabas</div>
                                        <div className="small text-gray-500">3 hours</div>
                                    </div>
                                    <span className="ml-auto small">
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="feather-more-vertical"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <button className="dropdown-item" type="button"><i className="feather-trash"></i> Delete</button>
                                                <button className="dropdown-item" type="button"><i className="feather-x-circle"></i> Turn Off</button>
                                            </div>
                                        </div>
                                    </span>
                                </div>
                                <div className="p-3 border-bottom osahan-post-body">
                                    <p className="mb-0">
                                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi iure saepe rem non corrupti quas.
                                        Repellendus maxime voluptate eius, porro consequatur, sed possimus facere veniam ratione esse
                                        reprehenderit dolores! Repellendus. <a href="#">laboris consequat.</a>
                                    </p>
                                </div>
                                <div className="p-3 border-botto osahan-post-footer d-flex justify-between text-center w-100 overflow-hidden row post_icon_container">
                                    <a href="#" className="text-secondary col"><i className="feather-share-2"></i> 2</a>
                                    <a href="#" className="text-secondary col"><i className="feather-message-square"></i> 8</a>
                                    <a href="#" className="text-secondary col"><i className="feather-eye "></i> 16</a>
                                    <a href="#" className="text-secondary col"><i className="feather-hear ">😍7</i></a>
                                </div>
                            </div> </div>
                        {/* Post 2 */}
                        <div className="col-xl-6 col-lg- col-md-6 col-12">
                            <div className="box mb-3 shadow- border rounded bg-white osahan-post">
                                <div className="p-3 d-flex align-items-center border-bottom osahan-post-header">
                                    <div className="dropdown-list-image mr-3">
                                        <img className="rounded-circle" src={imgTomilayo} alt="Yusuf Barnabas" />
                                        <div className="status-indicator bg-success"></div>
                                    </div>
                                    <div className="font-weight-bold">
                                        <div className="text-truncate">Yusuf Barnabas</div>
                                        <div className="small text-gray-500">2 min</div>
                                    </div>
                                    <span className="ml-auto small">
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="feather-more-vertical"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <button className="dropdown-item" type="button"><i className="feather-trash"></i> Delete</button>
                                                <button className="dropdown-item" type="button"><i className="feather-x-circle"></i> Turn Off</button>
                                            </div>
                                        </div>
                                    </span>
                                </div>
                                <div className="p-3 border-bottom osahan-post-body">
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur 😍😎 adipisicing elit, sed do eiusmod tempo incididunt ut
                                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                        <a href="#">laboris consequat.</a>
                                    </p>
                                    <img src={postImg1} className="img-fluid" alt="Post content" />
                                </div>
                                <div className="p-3 border-botto osahan-post-footer d-flex justify-between text-center w-100 overflow-hidden row post_icon_container">
                                    <a href="#" className="text-secondary col"><i className="feather-hear text-danger">😍</i></a>
                                    <a href="#" className="text-secondary col"><i className="feather-heart text-danger"></i> 16</a>
                                    <a href="#" className="text-secondary col"><i className="feather-message-square"></i> 8</a>
                                    <a href="#" className="text-secondary col"><i className="feather-share-2"></i> 2</a>
                                </div>
                            </div>
                        </div>
                        {/* Post 3 */}
                        <div className="col-xl-6 col-lg- col-md-6 col-12">
                            <div className=" box shadow-sm border rounded bg-white mb-3 osahan-post">
                                <div className="p-3 d-flex align-items-center border-bottom osahan-post-header">
                                    <div className="dropdown-list-image mr-3">
                                        <img className="rounded-circle" src={imgTomilayo} alt="Tomilayo Barnabas" />
                                        <div className="status-indicator bg-success"></div>
                                    </div>
                                    <div className="font-weight-bold">
                                        <div className="text-truncate">Tomilayo Barnabas</div>
                                        <div className="small text-gray-500">2 days</div>
                                    </div>
                                    <span className="ml-auto small">
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="feather-more-vertical"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <button className="dropdown-item" type="button"><i className="feather-trash"></i> Delete</button>
                                                <button className="dropdown-item" type="button"><i className="feather-x-circle"></i> Turn Off</button>
                                            </div>
                                        </div>
                                    </span>
                                </div>
                                <div className="p-3 border-bottom osahan-post-body">
                                    <p className="mb-0">
                                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi iure saepe rem non corrupti quas.
                                        Repellendus maxime voluptate eius, porro consequatur, sed possimus facere veniam ratione esse
                                        reprehenderit dolores! Repellendus. <a href="#">laboris consequat.</a>
                                    </p>
                                </div>
                                <div className="p-3 border-botto osahan-post-footer d-flex justify-between text-center w-100 overflow-hidden row post_icon_container">
                                    <a href="#" className="text-secondary col"><i className="feather-share-2"></i> 2</a>
                                    <a href="#" className="text-secondary col"><i className="feather-message-square"></i> 8</a>
                                    <a href="#" className="text-secondary col"><i className="feather-eye "></i> 16</a>
                                    <a href="#" className="text-secondary col"><i className="feather-hear ">😍7</i></a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MyMemes;