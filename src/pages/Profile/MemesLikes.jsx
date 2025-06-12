import React from 'react';
import Navbar from '../pageAssets/Navbar';
import cover_img from '../../assets/img/company-profile.jpg';
import friendImage from '../../assets/img/IMG_9488.jpeg';
import { FiEdit, FiBell, FiMoreHorizontal, FiCamera } from 'react-icons/fi';
import { FaFacebookF, FaGlobe, FaUserFriends, FaImages } from 'react-icons/fa';
import { IoMdPhotos } from 'react-icons/io';
import { RiVideoLine } from 'react-icons/ri';
import postImg from '../../assets/img/p1.png';
import postImg1 from '../../assets/img/post1.png';
import './MyProfilestyle.css';

function LikesMeme() {
    return (
        <div className="container p-4">
            <div class="row">
                <div class="col-md-4">
                    <a href="profile.html">
                        <div class="border network-item rounded mb-3">
                            <div className="p-3 border-bottom osahan-post-body">
                                <p className="mb-0 p-4" style={{ background: '#8000FF', color: 'white', }}>
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi iure saepe rem non corrupti quas.
                                    Repellendus maxime voluptate eius, porro consequatur, sed possimus facere veniam ratione esse
                                    reprehenderit dolores! Repellendus. <a href="#">laboris consequat.</a>
                                </p>
                            </div>
                            <div class="d-flex align-items-center p-3 border-top border-bottom network-item-body">
                                <div class="overlap-rounded-circle">
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="Sophia Lee" src={postImg} alt="" />
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="John Doe" src={postImg} alt="" />
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="Julia Cox" src={postImg} alt="" />
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="Robert Cook" src={postImg} alt="" />
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="Sophia Lee" src={postImg} alt="" />
                                </div>
                                <span class="font-weight-bold small text-primary">4 likes</span>
                            </div>

                        </div>
                    </a>
                </div>
                <div class="col-md-4">
                    <a href="profile.html">
                        <div class="border network-item rounded mb-3">
                            <div className="p-3 border-bottom osahan-post-body card">
                                <p className="mb-0">
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi iure saepe rem non corrupti quas.
                                    Repellendus maxime voluptate eius, porro consequatur, sed possimus facere veniam ratione esse
                                    reprehenderit dolores! Repellendus. <a href="#">laboris consequat.</a>
                                </p>
                            </div>
                            <div class="d-flex align-items-center p-3 border-top border-bottom network-item-body">
                                <div class="overlap-rounded-circle">
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="Sophia Lee" src={postImg} alt="" />
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="John Doe" src={postImg} alt="" />
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="Julia Cox" src={postImg} alt="" />
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="Robert Cook" src={postImg} alt="" />
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="Sophia Lee" src={postImg} alt="" />
                                </div>
                                <span class="font-weight-bold small text-primary">4 likes</span>
                            </div>

                        </div>
                    </a>
                </div>
                <div class="col-md-4">
                    <a href="profile.html">
                        <div class="border network-item rounded mb-3">
                            <div className="p-3 border-bottom osahan-post-body card">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur 😍😎 adipisicing elit, sed do eiusmod tempo incididunt ut
                                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                    <a href="#">laboris consequat.</a>
                                </p>
                                <img src={postImg1} className="img-fluid" alt="Post content" />
                            </div>
                            <div class="d-flex align-items-center p-3 border-top border-bottom network-item-body">
                                <div class="overlap-rounded-circle">
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="Sophia Lee" src={postImg} alt="" />
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="John Doe" src={postImg} alt="" />
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="Julia Cox" src={postImg} alt="" />
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="Robert Cook" src={postImg} alt="" />
                                    <img class="rounded-circle shadow-sm" data-toggle="tooltip" data-placement="top" title="Sophia Lee" src={postImg} alt="" />
                                </div>
                                <span class="font-weight-bold small text-primary">4 likes</span>
                            </div>

                        </div>
                    </a>
                </div>
                
            </div>
        </div>
    );
}

export default LikesMeme; 