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
    const { UserProfilePostData } = usePost();
    console.log(UserProfilePostData);
    return (
        <div className="profile-content container mt-4">
            <div className="row">
                {/* Left Sidebar */}

                {/* Main Feed */}
                <div className="col-xl-12  col-md-8 col-sm-12 " style={{ paddingBottom: '200px' }}>
                    {/* Create Post */}
                    <div className="row">
                        {UserProfilePostData ? (
                            UserProfilePostData.map(post => (
                                <div className='col-xl-6 col-lg- col-md-6 col-12'>
                                    <SinglePostTemplate
                                        key={post.post_id}
                                        data={post}
                                    /></div>
                            ))
                        ) : (
                            <div className="text-center py-5">
                                <p>No posts available</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MyMemes;