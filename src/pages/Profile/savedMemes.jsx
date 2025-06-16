import React from 'react';
import Navbar from '../pageAssets/Navbar';
import cover_img from '../../assets/img/company-profile.jpg';
import friendImage from '../../assets/img/IMG_9488.jpeg';
import { FiEdit, FiBell, FiMoreHorizontal, FiCamera } from 'react-icons/fi';
import { FaFacebookF, FaGlobe, FaUserFriends, FaImages } from 'react-icons/fa';
import { IoMdPhotos } from 'react-icons/io';
import { RiVideoLine } from 'react-icons/ri';
import postImg from '../../assets/img/p1.png';
import postImg1 from '../../assets/img/job1.png';
import './MyProfilestyle.css';

function SavedMeme() {
    return (
        <div className="container p-4">
            <div class="row ">
                <div class="col-xl-4 col-lg-4 col-md-6  col-sm-12 col-12">
                    <a href="profile.html">
                        <div class="border network-item rounded mb-3 card">
                            <div className="p-3 border-bottom osahan-post-body">
                                <p className="mb-0 p-4" style={{ background: '#8000FF', color: 'white', }}>
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi iure saepe rem non corrupti quas.
                                    Repellendus maxime voluptate eius, porro consequatur, sed possimus facere veniam ratione esse
                                    reprehenderit dolores! Repellendus. <a href="#">laboris consequat.</a>
                                </p>
                            </div>
                           <div class="d-flex align-items-center p-3 border-top border-bottom network-item-body">
                                 <span class="font-weight-bold small text-primary fa fa-bookmark"></span>
                            </div>

                        </div>
                    </a>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6  col-sm-12 col-12">
                    <a href="profile.html">
                        <div class="border network-item rounded mb-3 card">
                            <div className="p-3 border-bottom osahan-post-body card">
                                <p className="mb-0">
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi iure saepe rem non corrupti quas.
                                    Repellendus maxime voluptate eius, porro consequatur, sed possimus facere veniam ratione esse
                                    reprehenderit dolores! Repellendus. <a href="#">laboris consequat.</a>
                                </p>
                            </div>
                            <div class="d-flex align-items-center p-3 border-top border-bottom network-item-body">
                                 <span class="font-weight-bold small text-primary fa fa-bookmark"></span>
                            </div>

                        </div>
                    </a>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6  col-sm-12 col-12">
                    <a href="profile.html">
                        <div class="border network-item rounded mb-3 card">
                            <div className="p-3 border-bottom osahan-post-body card">
                               
                                <img src={postImg1} className="img-fluid" alt="Post content" />
                            </div>
                            <div class="d-flex align-items-center p-3 border-top border-bottom network-item-body">
                                 <span class="font-weight-bold small text-primary fa fa-bookmark"></span>
                            </div>

                        </div>
                    </a>
                </div>
                
            </div>
        </div>
    );
}

export default SavedMeme; 