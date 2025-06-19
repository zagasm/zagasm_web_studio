import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/zagasm_logo.png';
import logoMobile from '../../assets/ZAGASM_LOGO_ICON_V2_350PX.png';
import userImg from '../../assets/img/IMG_9488.jpeg';
import profileImg from '../../assets/img/IMG_9488.jpeg';
import p1 from '../../assets/img/p1.png';
import p2 from '../../assets/img/p2.png';
import p3 from '../../assets/img/p3.png';
import p4 from '../../assets/img/p4.png';
import home from '../../assets/home.png';
import Add_user from '../../assets/Add_user.png';
import creat_post from '../../assets/creat_post.png';
import default_profilePicture from '../../assets/avater_pix.avif';
// import './navStyle.css';
import MobileNav from './MobileNav';
import { useAuth } from '../auth/AuthContext';

const messages = [
    { img: p1, content: 'Sample message content 1', sender: 'Alice', time: '1h' },
    { img: p2, content: 'Sample message content 2', sender: 'Bob', time: '2h' },
    { img: p3, content: 'Sample message content 3', sender: 'Charlie', time: '3h' },
    { img: p4, content: 'Sample message content 4', sender: 'Diana', time: '4h' },
];

const Navbar = () => {
    const { user, logout } = useAuth();
    const Default_user_image = user.user_picture || default_profilePicture;
    return (
        <>
            <MobileNav />
            <nav className="navbar navbar-expand osahan-nav-top p-0 w-100 position-fixed" style={{ background: 'white' }}>
                <div className="container-fluid p-3">
                    <Link className="navbar-brand" to="/">
                        <img  src={logo} alt="Zagasm Logo" className="zagasm_logo" />
                        {/* <img src={logoMobile} alt="Zagasm Logo Mobile" className="d-block d-md-none" /> */}
                    </Link>
                    <form className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 navbar-search nav_search"></form>
                    <ul className="navbar-nav middle_nav text-center">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                <i className="fas fa-home" style={{
                                    fontSize: '24px',
                                    color: '#8000FF',
                                    marginRight: '20px'
                                }}></i>
                            </Link>
                        </li>

                        <li className="nav-item dropdown no-arrow mx-1 osahan-list-dropdown">
                            <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-plus-square" style={{
                                    fontSize: '24px',
                                    color: '#8000FF',
                                    marginRight: '20px'
                                }}></i>
                            </button>
                            <div className="dropdown-list dropdown-menu dropdown-menu-left shadow-sm dropdown-menu dropdown-menu-end dropdown-menu-left shadow-sm p-3">
                                <Link to={'/create-post'} className="text-gray-500 text-light btn d-flex justify-center p-2 border-none" style={{
                                    color: 'white',
                                    justifyContent: "space-between",
                                    alignItems: 'center',
                                    background: 'linear-gradient(to right, #8000FF, rgba(228, 40, 235, 0.87))'
                                }}>
                                    <i className="fas fa-pen"></i>
                                    <span>Create Post</span>
                                    <i className="fas fa-chevron-right"></i>
                                </Link>
                                <Link className="mt-2 text-gray-500 btn-success text-light btn d-flex justify-center p-2 border-none" style={{
                                    justifyContent: "space-between",
                                    alignItems: 'center'
                                }} to="/notifications">
                                    <i className="fas fa-layer-group"></i>
                                    <span>Create Template</span>
                                    <i className="fas fa-chevron-right"></i>
                                </Link>
                            </div>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/friends">
                                <i className="fas fa-user-plus" style={{
                                    fontSize: '24px',
                                    color: '#8000FF',
                                    marginRight: '20px'
                                }}></i>
                            </Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav ml-auto d-flex align-items-center">
                        {/* Messages Dropdown */}
                        <li className="nav-item dropdown no-arrow mx-1 osahan-list-dropdown">
                            <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="right-icon nav-ico fa fa-comments" ></i>
                                <span className="badge badge-danger badge-counter">8</span>
                            </button>
                            <div className="dropdown-list dropdown-menu dropdown-menu-right shadow-sm dropdown-menu dropdown-menu-end dropdown-menu-left shadow-sm">
                                <h6 className="dropdown-header">Message Center</h6>
                                {messages.map((msg, i) => (
                                    <Link key={i} className="dropdown-item d-flex align-items-center" to="/chat">
                                        <div className="dropdown-list-image mr-3">
                                            <img className="rounded-circle" src={msg.img} alt={`Sender ${i + 1}`} />
                                            <div className={`status-indicator ${i % 2 === 0 ? 'bg-success' : i === 2 ? 'bg-warning' : ''}`}></div>
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="text-truncate">{msg.content}</div>
                                            <div className="small text-gray-500">{msg.sender} · {msg.time}</div>
                                        </div>
                                    </Link>
                                ))}
                                <Link className="dropdown-item text-center small text-gray-500" to="/messages">Read More Messages</Link>
                            </div>
                        </li>

                        {/* Alerts Dropdown */}
                        <li className="nav-item dropdown no-arrow mx-1 osahan-list-dropdown">
                            <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="right-icon nav-ico fa fa-bell" ></i>
                                <span className="badge badge-danger badge-counter">6</span>
                            </button>
                            <div className="dropdown-list dropdown-menu dropdown-menu-left shadow-sm dropdown-menu dropdown-menu-end dropdown-menu-left shadow-sm">
                                <h6 className="dropdown-header">Alerts Center</h6>
                                <Link className="dropdown-item d-flex align-items-center" to="/notifications">
                                    <div className="mr-3">
                                        <div className="icon-circle bg-primar" style={{background:'#8000FF'}}>
                                            <i className=" fa fa-file text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="small text-gray-500">Dec 12, 2019</div>
                                        <span className="font-weight-bold">New monthly report is ready!</span>
                                    </div>
                                </Link>
                                <Link className="dropdown-item text-center small text-gray-500" to="/notifications">Show All Alerts</Link>
                            </div>
                        </li>

                        <li className="nav-item dropdown no-arrow mx-1 osahan-list-dropdown">
                            <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img style={{ width: '50px', height: '50px' }} className="img-profile rounded-circle" src={Default_user_image} alt="User Profile" />
                            </button>
                            <div className="dropdown-list dropdown-menu dropdown-menu-left shadow-sm dropdown-menu dropdown-menu-end dropdown-menu-left shadow-sm">
                                <div className="p-3 d-flex align-items-center">
                                    <div className="dropdown-list-image mr-3">
                                        <img className="rounded-circle" src={Default_user_image} alt="User" />
                                        <div className="status-indicator bg-success"></div>
                                    </div>
                                    <div className="font-weight-bold">
                                        <div className="text-truncate">{user.user_lastname} {user.user_firstname}</div>
                                        <div className="small text-gray-500">@{user.user_name}</div>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <Link className="dropdown-item" to="/myprofile"><i className=" feather-edit mr-1"></i> My Account</Link>
                                <Link className="dropdown-item" to="/myprofile"><i className=" feather-user mr-1"></i> Edit Profile</Link>
                                <div className="dropdown-divider"></div>
                                <Link onClick={() => logout()} className="dropdown-item" ><i className=" feather-log-out mr-1"></i> Logout</Link>
                            </div>
                        </li>


                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
