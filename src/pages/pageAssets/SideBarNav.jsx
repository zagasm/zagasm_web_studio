import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navStyle.css';
import SidebarLoader from '../../component/assets/Loader/sidebarLoader';

import discover_icon from '../../assets/navbar_icons/discover_icon.svg';
import saved_icon from '../../assets/navbar_icons/saved_icon.svg';
import template_icon from '../../assets/navbar_icons/template_icon.svg';
import { useAuth } from '../auth/AuthContext';
import default_profilePicture from '../../assets/avater_pix.avif';

function SideBarNav() {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const location = useLocation();
  const Default_user_image = user.profileUrl != null ? user.profileUrl : default_profilePicture;

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    // if (isLoading) return <SidebarLoader />;

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="shadow-sm side_bar_container bg-white">
            <div className="box mb-3 rounde bg-white list-sidebar">
                <ul className="list-group list-group-flush side_bar_nav">
                    <Link to="/">
                        <li className={`list-group-item pl-3 pr-3 d-flex align-items-center ${isActive('/') ? 'active' : ''}`}>
                            <img src={discover_icon} alt="Home" />
                            <span className="link_name">Discover</span>
                        </li>
                    </Link>
                    <Link to="event/saved-events">
                        <li className={`list-group-item pl-3 pr-3 d-flex align-items-center ${isActive('/event/saved-events') ? 'active' : ''}`}>
                            <img src={saved_icon} alt="Saved" />
                            <span className="link_name">Saved Events</span>
                        </li>
                    </Link>
                    <Link to="/template">
                        <li className={`list-group-item pl-3 pr-3 d-flex align-items-center ${isActive('/template') ? 'active' : ''}`}>
                            <img src={template_icon} alt="Template" />
                            <span className="link_name">Template</span>
                        </li>
                    </Link>
                </ul>
            </div>

            {/* <div className="d-flex align-items-center osahan-post-header mb-3 people-list position-absolute bottom-0 ml-3">
                <div className="dropdown-list-image mr-3">
                    <img className="rounded-circle" src={Default_user_image} alt="User" />
                    <div className="status-indicator bg-success"></div>
                </div>
                <div className="font-weight-bold mr-2 side_bar_user_name">
                    <div className="text-truncate">
                        <Link to={'/myprofile'} className="text-dark">
                            user name
                        </Link>
                    </div>
                    <div className="small text-gray-500">@Tomconnect</div>
                </div>
            </div> */}
        </aside>
    );
}

export default SideBarNav;
