import React from 'react';
import Navbar from '../pageAssets/Navbar';
import logo from '../../assets/zagasm_logo.png';
import './Homestyle.css';
import SideBarNav from '../pageAssets/sideBarNav';
import RightBarComponent from '../pageAssets/rightNav';
import SuggestedFriends from '../../component/Friends/suggestedFriends';
import SideAds from '../../component/ads/sideAds';

// Imported image assets
import imgTomilayo from '../../assets/img/IMG_9488.jpeg';
import postImg1 from '../../assets/img/post1.png';

function Home() {
    return (
        <div className="py-4">
            <div className="container-fluid p-0">
                <SideBarNav />
                <div className="row offset-xl-3 offset-lg-1 offset-md-1">
                    <main className="col col-xl-8 order-xl-2 col-lg-8 order-lg-1 col-md-12 col-sm-12 col-12 main_container bg-dange">
                        <div className="containe">
                            {/* Post 1 */}
                            <div className="box shadow-l border rounded bg-white mb-3 osahan-post car">
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
                                    <a href="#" className="text-secondary col"><i className="feather-hear text-danger">😍</i></a>
                                    <a href="#" className="text-secondary col"><i className="feather-heart text-danger"></i> 16</a>
                                    <a href="#" className="text-secondary col"><i className="feather-message-square"></i> 8</a>
                                    <a href="#" className="text-secondary col"><i className="feather-share-2"></i> 2</a>
                                </div>
                            </div>

                            {/* Post 2 */}
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

                            {/* Post 3 */}
                            <div className="box shadow-sm border rounded bg-white mb-3 osahan-post">
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
                                    <a href="#" className="text-secondary col"><i className="feather-hear text-danger">😍</i></a>
                                    <a href="#" className="text-secondary col"><i className="feather-heart text-danger"></i> 16</a>
                                    <a href="#" className="text-secondary col"><i className="feather-message-square"></i> 8</a>
                                    <a href="#" className="text-secondary col"><i className="feather-share-2"></i> 2</a>
                                </div>
                            </div>
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
