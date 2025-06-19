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
import { usePost } from '../../component/Posts/PostContext';
import SinglePostTemplate from '../../component/Posts/single';

function MyMemes() {
    const { UserProfilePostData, refreshProfilePost } = usePost();
    console.log(UserProfilePostData);
    return (
        <div className="profile-content container mt-4">
            <div className="row">
                {/* Left Sidebar */}

                {/* Main Feed */}
            <div className="post-grid">
  {UserProfilePostData && UserProfilePostData.length > 0 ? (
    UserProfilePostData.map(post => (
      <div className="post-grid-item" key={post.post_id}>
        <SinglePostTemplate data={post} />
      </div>
    ))
  ) : (
    <div className="text-center py-5">
      <p>No posts available</p>
    </div>
  )}
</div>



            </div>
        </div>
    );
}

export default MyMemes;