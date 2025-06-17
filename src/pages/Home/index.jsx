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

// import LoadingOverlay from '../../assets/projectOverlay';

function Home() {
    const { HomePostData } = usePost();
    console.log(HomePostData);
    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: { slidesToShow: 1 }
            }
        ]
    };


    return (
        <div className="py-4">

            <div className="container-fluid p-0">
                <SideBarNav />
                <div className="row offset-xl-3 offset-lg-1 offset-md-1">
                    <main className="col col-xl-8 order-xl-2 col-lg-8 order-lg-1 col-md-12 col-sm-12 col-12 main_container">

                        {/* <div className="mb-3 shadow-s rounded box bg-whit osahan-slider-main">
                            <div className="osahan-slide mt-4">
                                <Slider {...sliderSettings}>
                                    <div className="osahan-slider-item">
                                        <div className="shadow-sm border rounded bg-white job-item mr-2 mt-3 mb-3">
                                            <div className="d-flex align-items-center p-3 job-item-header">
                                                <div className="overflow-hidden mr-2">
                                                    <h6 className="font-weight-bold text-dark mb-0 text-truncate">UI/UX Designer</h6>
                                                    <div className="text-truncate text-primary">Envato</div>
                                                    <div className="small text-gray-500">
                                                        <i className="feather-map-pin"></i> India, Punjab
                                                    </div>
                                                </div>
                                                <img className="img-fluid ml-auto" src="/img/l1.png" alt="Logo" />
                                            </div>
                                            <div className="d-flex align-items-center p-3 border-top border-bottom job-item-body">
                                                <div className="overlap-rounded-circle d-flex">
                                                    <img className="rounded-circle shadow-sm" src="/img/p1.png" alt="" />
                                                    <img className="rounded-circle shadow-sm" src="/img/p2.png" alt="" />
                                                    <img className="rounded-circle shadow-sm" src="/img/p3.png" alt="" />
                                                    <img className="rounded-circle shadow-sm" src="/img/p4.png" alt="" />
                                                    <img className="rounded-circle shadow-sm" src="/img/p5.png" alt="" />
                                                </div>
                                                <span className="font-weight-bold text-primary ml-auto">18 connections</span>
                                            </div>
                                            <div className="p-3 job-item-footer">
                                                <small className="text-gray-500">
                                                    <i className="feather-clock"></i> Posted 3 Days ago
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="osahan-slider-item">
                                        <div className="shadow-sm border rounded bg-white job-item mr-2 mt-3 mb-3">
                                            <div className="d-flex align-items-center p-3 job-item-header">
                                                <div className="overflow-hidden mr-2">
                                                    <h6 className="font-weight-bold text-dark mb-0 text-truncate">.NET Developer</h6>
                                                    <div className="text-truncate text-primary">Invision</div>
                                                    <div className="small text-gray-500">
                                                        <i className="feather-map-pin"></i> London, UK
                                                    </div>
                                                </div>
                                                <img className="img-fluid ml-auto" src="/img/l4.png" alt="Logo" />
                                            </div>
                                            <div className="d-flex align-items-center p-3 border-top border-bottom job-item-body">
                                                <div className="overlap-rounded-circle d-flex">
                                                    <img className="rounded-circle shadow-sm" src="/img/p13.png" alt="" />
                                                    <img className="rounded-circle shadow-sm" src="/img/p1.png" alt="" />
                                                    <img className="rounded-circle shadow-sm" src="/img/p2.png" alt="" />
                                                    <img className="rounded-circle shadow-sm" src="/img/p3.png" alt="" />
                                                </div>
                                                <span className="font-weight-bold text-primary ml-auto">12 connections</span>
                                            </div>
                                            <div className="p-3 job-item-footer">
                                                <small className="text-gray-500">
                                                    <i className="feather-clock"></i> Posted 5 Days ago
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </Slider>
                            </div>
                        </div> */}
                        <div className="containe">
                            {HomePostData && HomePostData.length > 0  ? (
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
                        {/* <SideAds /> */}
                    </RightBarComponent>
                </div>
            </div>
        </div>
    );
}

export default Home;