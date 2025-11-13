import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navStyle.css';
import { useAuth } from '../auth/AuthContext';
import discover_icon from '../../assets/navbar_icons/discover_icon.svg';
import saved_icon from '../../assets/navbar_icons/saved_icon.svg';
import template_icon from '../../assets/navbar_icons/template_icon.svg';
import default_profilePicture from '../../assets/avater_pix.avif';

function MobileNav() {
    const location = useLocation();
    const { user } = useAuth();
    const currentPath = location.pathname;
    const Default_user_image = user.profileUrl != null ? user.profileUrl : default_profilePicture;
    console.log('Mobile',user);
    const navLinks = [
        {
            name: 'Discover',
            to: '/feed',
            icon: discover_icon,
            active: currentPath === '/feed'
        },
        {
            name: 'Saved',
            to: '/event/saved-events',
            icon: saved_icon,
            active: currentPath === '/event/saved-events'
        },
        {
            name: 'Tickets',
            to: '/tickets',
            icon: template_icon,
            active: currentPath === '/tickets'
        },
        {
            name: 'Account',
            to: '/account',
            icon: Default_user_image,
            active: currentPath === '/account',
            isProfile: true
        }
    ];

    return (
        <div className="mobile_navbar_container">
            <div className="floating-nav-wrapper">
                {navLinks.map((link, index) => {
                    const isActive = link.active;
                    return (
                        <Link
                            key={link.name}
                            to={link.to}
                            className={`nav-link ${isActive ? 'active float-up' : ''}`}
                            style={{ '--float-order': index % 2 === 0 ? 1 : 1.5 }}
                            onClick={(e) => {
                                const ripple = document.createElement("span");
                                ripple.className = "ripple";
                                ripple.style.left = `${e.nativeEvent.offsetX}px`;
                                ripple.style.top = `${e.nativeEvent.offsetY}px`;
                                e.currentTarget.appendChild(ripple);
                                setTimeout(() => ripple.remove(), 600);
                            }}

                        >
                            <div className="nav-content">
                                {link.isProfile ? (
                                    <img
                                        className="nav-icon profile-pic"
                                        src={link.icon}
                                        alt={link.name}
                                        style={{ width: '30px', height: '30px' }}
                                    />
                                ) : (
                                    <img className="nav-icon" src={link.icon} alt={link.name} />
                                )}
                                <span className="mobile_icon_name">{link.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default MobileNav;
