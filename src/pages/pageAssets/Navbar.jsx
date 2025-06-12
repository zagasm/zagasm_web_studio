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
import './navStyle.css';
import MobileNav from './MobileNav';

const messages = [
    { img: p1, content: 'Sample message content 1', sender: 'Alice', time: '1h' },
    { img: p2, content: 'Sample message content 2', sender: 'Bob', time: '2h' },
    { img: p3, content: 'Sample message content 3', sender: 'Charlie', time: '3h' },
    { img: p4, content: 'Sample message content 4', sender: 'Diana', time: '4h' },
];

const Navbar = () => {
    return (
        <>
            <MobileNav />
            <nav className="navbar navbar-expand osahan-nav-top p-0 w-100 position-fixed" style={{ background: 'white' }}>
                <div className="container-fluid p-3">
                    <Link className="navbar-brand" to="/">
                        <img src={logo} alt="Zagasm Logo" className="d-none d-md-block" />
                        <img src={logoMobile} alt="Zagasm Logo Mobile" className="d-block d-md-none" />
                    </Link>

                    <form className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 navbar-search nav_search">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control border-0"
                                placeholder="What's funny today? #Hashtag..."
                                aria-label="Search what's funny today"
                                style={{ outline: '0px' }}
                            />
                        </div>
                    </form>

                    <ul className="navbar-nav middle_nav text-center">
                        <li className="nav-item">
                            <Link className="nav-link" to="/home">
                                <i className="nav-icon feather-home mr-2"></i>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/create">
                                <i className="nav-icon feather-plus-circle mr-2"></i>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/invite">
                                <i className="nav-icon feather-user-plus"></i>
                            </Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav ml-auto d-flex align-items-center">
                        {/* Messages Dropdown */}
                        <li className="nav-item dropdown no-arrow mx-1 osahan-list-dropdown">
                            <button className="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="right-icon nav-icon feather-message-square" style={{ fontSize: '25px' }}></i>
                                <span className="badge badge-danger badge-counter">8</span>
                            </button>
                            <div className="dropdown-list dropdown-menu dropdown-menu-right shadow-sm">
                                <h6 className="dropdown-header">Message Center</h6>
                                {messages.map((msg, i) => (
                                    <Link key={i} className="dropdown-item d-flex align-items-center" to="chat">
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
                            <button className="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="right-icon nav-icon feather-bell" style={{ fontSize: '25px' }}></i>
                                <span className="badge badge-danger badge-counter">6</span>
                            </button>
                            <div className="dropdown-list dropdown-menu dropdown-menu-right shadow-sm">
                                <h6 className="dropdown-header">Alerts Center</h6>
                                <Link className="dropdown-item d-flex align-items-center" to="/notifications">
                                    <div className="mr-3">
                                        <div className="icon-circle bg-primary">
                                            <i className="nav-icon feather-download-cloud text-white"></i>
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

                        {/* User Profile Dropdown */}
                        <li className="nav-item dropdown no-arrow ml-1 osahan-profile-dropdown">
                            <button className="nav-link dropdown-toggle pr-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img className="img-profile rounded-circle" src={profileImg} alt="User Profile" />
                            </button>
                            <div className="dropdown-menu dropdown-menu-right shadow-sm">
                                <div className="p-3 d-flex align-items-center">
                                    <div className="dropdown-list-image mr-3">
                                        <img className="rounded-circle" src={userImg} alt="User" />
                                        <div className="status-indicator bg-success"></div>
                                    </div>
                                    <div className="font-weight-bold">
                                        <div className="text-truncate">Gurdeep Osahan</div>
                                        <div className="small text-gray-500">UI/UX Designer</div>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <Link className="dropdown-item" to="/profile"><i className="nav-icon feather-edit mr-1"></i> My Account</Link>
                                <Link className="dropdown-item" to="/edit-profile"><i className="nav-icon feather-user mr-1"></i> Edit Profile</Link>
                                <div className="dropdown-divider"></div>
                                <Link className="dropdown-item" to="/sign-in"><i className="nav-icon feather-log-out mr-1"></i> Logout</Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
