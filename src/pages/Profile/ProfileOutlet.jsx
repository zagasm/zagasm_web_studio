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
import './Profilestyle.css';
import { Outlet } from 'react-router-dom';
import ProfileHeader from './Header';

function ProfileOutlet() {
    return (
        <>   
            <ProfileHeader />
            <Outlet />
        </>
    );
}

export default ProfileOutlet;