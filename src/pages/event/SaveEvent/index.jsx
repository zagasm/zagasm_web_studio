import React, { useState } from 'react';
import RightBarComponent from '../../../component/RightBarComponent';
import SaveEventTemplate from '../../../component/Events/saveEvent';
import SideBarNav from '../../pageAssets/SideBarNav';
import SuggestedOrganizer from '../../../component/Suggested_organizer/suggestedOrganizer';
import SEO from '../../../component/SEO';

function SaveEvents() {
    return (
        <>
            <SEO 
                title="Saved Events - Your Favorite Events"
                description="View and manage your saved events at Zagasm Studios. Keep track of concerts, festivals, parties and events you're interested in attending."
                keywords="zagasm studios, saved events, favorite events, my events, bookmarked events, event wishlist, upcoming events, event tracking"
            />
            <div className="container-flui m-0 p-0">
                <SideBarNav />
                <div className="page_wrapper overflow-hidden">
                    <div className="row p-0 ">
                        <div className="col pb-5 mb-5 mt-4">
                            {/* <h4 className='mt-3 ml-2'>Save Event</h4> */}
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
        </>
    );
}
export default SaveEvents;