import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navStyle.css';

function MobileNav() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="shadow-sm mobile_navbar_container">
            <div className="box rounded list-sideba">
                <ul className="side_bar_na p-0">
                    <Link
                        to="/"
                        className={currentPath === '/' ? 'active' : ''}
                    >
                        <i className="feather-home"></i>
                        <span className="mobile_icon_name">Home</span>
                    </Link>

                    <Link
                        to="/explore"
                        className={currentPath === '/explore' ? 'active' : ''}
                    >
                        <i className="feather-search"></i>
                        <span className="mobile_icon_name">Explore</span>
                    </Link>

                    <Link
                        to="/create-post"
                        className={currentPath === '/create-post' ? 'active' : ''}
                    >
                        <i className="feather-plus"></i>
                        <span className="mobile_icon_name">Create post</span>
                    </Link>

                    <Link
                        to="/myprofile"
                        className={currentPath.startsWith('/myprofile') ? 'active' : ''}
                    >
                        <i className="feather-user"></i>
                        <span className="mobile_icon_name">Profile</span>
                    </Link>
                </ul>
            </div>
        </div>
    );
}

export default MobileNav;
