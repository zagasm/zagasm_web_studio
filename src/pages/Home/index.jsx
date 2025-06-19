import React from 'react';
import Navbar from '../pageAssets/Navbar';
import logo from '../../assets/zagasm_logo.png';
import './Homestyle.css';
import SideBarNav from '../pageAssets/sideBarNav';
import RightBarComponent from '../pageAssets/rightNav';
import SuggestedFriends from '../../component/Friends/suggestedFriends';
import SinglePostTemplate from '../../component/Posts/single';
import { usePost } from '../../component/Posts/PostContext';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SideAds from '../../component/ads/sideAds';
import { Link } from 'react-router-dom';

// import LoadingOverlay from '../../assets/projectOverlay';

function Home() {
    const { HomePostData } = usePost();
    console.log(HomePostData);


    return (
        <div className="py-4">
            <div className="container-fluid p-0">
                <SideBarNav />
                <div className="ro offset-xl-4 offset-lg-1 offset-md-1  bg-none ">
                    <main className="col col-xl-6  col-lg-8  col-md-12 col-sm-12 col-12 main_container  m-0 " >
                        <div className="car shadow-s mb-3 p-2">
                            <div className="heading_tab_container text-center  d-flex w-100 justify-content-between align-items-center">
                                <Link to="/" className="following_tab tab active w-50"> 
                                    Following
                                </Link>
                                <Link className="for_you_tab tab w-50 " href="/for-you">
                                    For you
                                </Link>

                            </div>
                        </div>
                        <div>
                            {HomePostData && HomePostData.length > 0 ? (
                                HomePostData.map(post => (
                                    <SinglePostTemplate
                                        key={post.post_id}
                                        data={post}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-5 ">
                                    <p>Fetching for posts <span className='fa fa-spinner fa-spin'></span></p>
                                </div>
                            )}
                        </div>
                    </main>

                    <RightBarComponent>
                        <SuggestedFriends />
                        <SideAds />
                    </RightBarComponent>
                </div>
            </div>
        </div>
    );
}

export default Home;