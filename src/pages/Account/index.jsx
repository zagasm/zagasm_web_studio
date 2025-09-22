import React, { useState } from 'react';
import SideBarNav from '../pageAssets/sideBarNav';
import AccountHeading from './AccountHeading';
import rocket from '../../assets/navbar_icons/rocket.png';
import angle_right from '../../assets/navbar_icons/angle_right.png';
import Users_icon from '../../assets/navbar_icons/Users_icon.png';
import Info_circle from '../../assets/navbar_icons/Info_circle.png';
import Bell from '../../assets/navbar_icons/Bell.png';
import key from '../../assets/navbar_icons/key.png';
import Document from '../../assets/navbar_icons/Document.png';
import login from '../../assets/navbar_icons/login.png';
import Laptop from '../../assets/navbar_icons/laptop.png';
import { Link } from 'react-router-dom';
import './accountStyling.css';
import { useAuth } from '../auth/AuthContext';
import default_profilePicture from '../../assets/avater_pix.avif';
function Account() {
    const { user, logout } = useAuth();
    const Default_user_image = user?.profileUrl ? user.profileUrl : default_profilePicture;
    return (
        <div className="container-flui m-0 p-0">
            <SideBarNav />
            <div className="page_wrapper overflow-hidden">
                <div className="row p-0 ">
                    <div className="col account_section ">
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 col-12 p-0 m-0">
                                <AccountHeading />
                            </div>
                            <div className="col-xl-9 col-lg-8 col-md-7 col-sm-12 col-12 p-0 m-0">
                                <div className="account_nav_section">
                                    <div>
                                        <div className="row">
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 Preference_section">
                                                <div className=" internal_container">
                                                    <h6>Preference</h6>
                                                    <ul>
                                                        <li>
                                                            <Link to={"/account/interest"} className=' account_link'>
                                                                <div>
                                                                    <img src={rocket} alt="" />
                                                                    <span>Interest</span>
                                                                </div>
                                                                <div>

                                                                    <i className="fa fa-angle-right "></i>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to={"/account/interest"} className=' account_link'>
                                                                <div>
                                                                    <img src={Users_icon} alt="" />
                                                                    <span>Organizers you follow</span>
                                                                </div>
                                                                <div>

                                                                    <i className="fa fa-angle-right "></i>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                        <li className='p-0 m-0' style={{ margin: '0px' }}>
                                                            <Link to={"/account/manage-notification"} className=' account_link'>
                                                                <div>
                                                                    <img src={Bell} alt="" />
                                                                    <span>Manage notification</span>
                                                                </div>
                                                                <div>

                                                                    <i className="fa fa-angle-right "></i>
                                                                </div>
                                                            </Link>
                                                        </li>

                                                    </ul>
                                                </div>
                                            </div>

                                        </div>
                                        {/* <div className="row mt-5">
                                            <div className="col">
                                                <div className="internal_container">
                                                    <h6>Legal</h6>
                                                    <ul>
                                                        <li>
                                                            <Link to={""} className=' account_link'>
                                                                <div>
                                                                    <img src={Document} alt="" />
                                                                    <span>Tearm of service</span>
                                                                </div>
                                                                <div>
                                                                    <i className="fa fa-angle-right "></i>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to={""} className=' account_link'>
                                                                <div>
                                                                    <img src={Laptop} alt="" />
                                                                    <span>Accessibility</span>
                                                                </div>
                                                                <div>
                                                                    
                                                                    <i className="fa fa-angle-right "></i>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to={""} className=' account_link'>
                                                                <div>
                                                                    <img src={key} alt="" />
                                                                    <span>Privacy</span>
                                                                </div>
                                                                <div>
                                                                    
                                                                    <i className="fa fa-angle-right "></i>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="d-flex justify-content-between mt-3 footer_section p-2 mb-3">
                                            <span>Version</span>
                                            <span>120.0382j2.465</span>
                                        </div>
                                        <Link onClick={() => logout()} className='logout_section p-2 d-inline'>
                                            <img src={login} alt="" />  <span>Logout </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;