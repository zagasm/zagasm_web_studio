import React, { useState } from 'react';
import './AccountHeadingStyling.css';
import { Link } from 'react-router-dom';
import default_profilePicture from '../../../assets/avater_pix.avif';
import { useAuth } from '../../auth/AuthContext';
function AccountHeading() {
    const { user } = useAuth();
    const Default_user_image = user?.profileUrl ? user.profileUrl : default_profilePicture;
    const user_id = user?.id;
    // console.log('User in AccountHeading:', user);
    return (

        <div className="account_heading_section bg-dange">
            <div className="details_display">
                <div className='profle_img'>
                    <img
                        className=""
                        src={Default_user_image}
                        loading="lazy"
                    />
                </div>
                <div className='profile_info '>
                    <div>
                        <small><b>Username</b></small> <br />
                        <small>0 events attended</small>
                        <p className='follow_section'><small> <span>12</span> following</small> <small> <span>302</span> followers</small></p>
                    </div>
                </div>
                <div className='View_Profile_button'>
                        <Link to={'/profile/'+user_id}>View profile</Link>
                   
                </div>
            </div>

        </div>
    );
}

export default AccountHeading;