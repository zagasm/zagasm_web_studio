import React, { useState } from 'react';
// 
// import live_camera from '../../assets/navbar_icons/solar_stream-broken.svg';
import RightBarComponent from '../../../component/RightBarComponent';
import SaveEventTemplate from '../../../component/Events/saveEvent';
import SideBarNav from '../../pageAssets/sideBarNav';
import SuggestedOrganizer from '../../../component/Suggested_organizer/suggestedOrganizer';

function SaveEvents() {
    return (
        <div className="container-flui m-0 p-0">
            <SideBarNav />
            <div className="page_wrapper overflow-hidden">
                <div className="row p-0 ">
                    <div className="col pb-5 mb-5">
                        <h4 className='mt-3 ml-2'>Save Event</h4>
                        <div className="row">
                            <SaveEventTemplate />
                        </div>
                    </div>
                    <RightBarComponent>
                        <SuggestedOrganizer />
                    </RightBarComponent>
                </div>
            </div>
        </div>
    );
}

export default SaveEvents;