import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/zagasm_logo.png';
import bell_icon from '../../assets/navbar_icons/Bell.png';
import Edit_icon from '../../assets/navbar_icons/Edit_icon.png';
import search_icon from '../../assets/navbar_icons/search_icon.png';
import search from '../../assets/navbar_icons/search.svg';
import Group from '../../assets/navbar_icons/Group.svg';
import bar from '../../assets/navbar_icons/bar.svg';

import default_profilePicture from '../../assets/avater_pix.avif';
import MobileNav from './MobileNav';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const Default_user_image = user.profileUrl != null ? user.profileUrl : default_profilePicture;

    // Function to truncate name parts to max 10 characters
    const truncateName = (name) => {
        if (!name) return '';
        return name.length > 10 ? name.slice(0, 10) + '...' : name;
    };

    const displayFirstName = truncateName(user.firstName);
    const displayLastName = truncateName(user.lastName);

    return (
        <>
            <MobileNav />
            <nav className="navbar navbar-expand osahan-nav-top p-0 w-100 position-fixed" style={{ background: 'white' }}>
                <div className="container-fluid p-3">
                    <Link className="navbar-brand " to="/">
                        <img src={logo} alt="Zagasm Logo" className="zagasm_logo" />
                    </Link>

                    <form className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 navbar-search nav_search"></form>

                    <ul className="navbar-nav middle_nav text-center">
                        <li className="nav-item">
                            <Link className="nav-link search_form" to="/explore">
                                <span>Search for events, creators or genres...</span>
                                <img src={search} alt="search icon" />
                            </Link>
                        </li>
                        <li className="nav-item dropdown no-arrow mx- osahan-list-dropdown mr-5">
                            <Link to={'/event/create-event'} className="nav-link dropdown-toggl create_post_btn shadow-sm p-3 text-light">
                                <img src={Group} alt="notification icon" /> <span>Create Event</span>
                            </Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav ml-auto d-flex align-items-center">
                        <li className="nav-item dropdown no-arrow mx-1 osahan-list-dropdown">
                            <Link to={'/notification'} className="nav-link dropdown-toggle p-2">
                                <img className='nav_icon_img' src={bell_icon} alt="notification icon" />
                                <span
                                    style={{
                                        background: '#8F07E7',
                                        fontWeight: '700',
                                        fontSize: '9px',
                                        height: "18px",
                                        top: '5px',
                                        left: '19px',
                                        width: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingLeft: '1px'
                                    }}
                                    className="badge badge-counter m-0"
                                >
                                    0
                                </span>
                            </Link>
                        </li>

                        <li className="nav-item dropdown no-arro0 mx-1 osahan-list-dropdown profile_link">
                            <button
                                style={{ borderRadius: '20px', padding: '0px 10px', marginLeft: '20px' }}
                                className="nav-link dropdown-toggl shadow-sm"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <img className="nav_icon_img img-profile rounded-circle" src={Default_user_image} alt="User Profile" />
                                <img src={bar} alt="notification icon" />
                            </button>
                            <div style={{ border: 'none' }} className="dropdown-list dropdown-menu dropdown-menu-left shadow-sm dropdown-menu dropdown-menu-end border-none">
                                <div className="px-3 d-flex align-items-center">
                                    <div className="dropdown-list-image">
                                        <img className="rounded-circle nav_icon_img" src={Default_user_image} alt="User" />
                                    </div>
                                    <div className="font-weight-bold" style={{ marginTop: '-20px' }}>
                                        <div className="text-truncate m-0 p-0" style={{ fontWeight: 'lighter' }}>
                                            {displayFirstName} {displayLastName}
                                        </div>
                                    </div>
                                </div>
                                <Link style={{ border: 'none' }} className="dropdown-item border-bottom mb-3" to={"/account"}>
                                    <i className="feather-settings mr-1"></i> Settings
                                </Link>
                                <Link style={{ border: 'none' }} className="dropdown-item border-bottom mb-3" to={"/profile/edit-profile"}>
                                    <i className="feather-settings mr-1"></i> Edit profile
                                </Link>
                                <Link onClick={() => logout()} className="dropdown-item" style={{ border: 'none', color: 'red' }}>
                                    <i className="feather-log-out mr-1"></i> Sign Out
                                </Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
