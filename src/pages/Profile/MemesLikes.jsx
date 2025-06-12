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
                            <div class="p-3 d-flex align-items-center network-item-header">
                                <div class="dropdown-list-image mr-3">
                                    <img class="rounded-circle" src={postImg} alt="" />
                                </div>
                                <div class="font-weight-bold">
                                    <h6 class="font-weight-bold text-dark mb-0">Sophia Lee</h6>
                                    <div class="small text-black-50">Photographer at Photography</div>
                                </div>
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