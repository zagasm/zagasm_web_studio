import React, { useState } from 'react';
import './AccountHeadingStyling.css';
import { Link } from 'react-router-dom';
import default_profilePicture from '../../../assets/avater_pix.avif';
import { useAuth } from '../../auth/AuthContext';
function AccountHeading() {
    const {user} = useAuth();
       const Default_user_image = user?.profileUrl ? user.profileUrl : default_profilePicture;
    return (

        <div className="heading_section">
            <div className="details_display">
                <div className='d-flex '>
                    <div className='profle_img'>
                        <img
                            className=""
                            src={Default_user_image}
                            loading="lazy"
                        />
                    </div>
                    <div className='profile_info '>
                        <div>
                            <small> <b>Username</b></small> <br />
                            <small>0 events attended</small>
                            <p className='follow_section'><small>12 following</small> <small>302 followers</small></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='create_event_section'>
                <div>
                    <Link to={'/event/create-event'}>Create Events <i className='fa fa-users'></i></Link>
                </div>
            </div>
        </div>
    );
}

export default AccountHeading;