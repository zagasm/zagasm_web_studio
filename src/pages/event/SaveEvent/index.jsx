import React from "react";
import RightBarComponent from "../../../component/RightBarComponent";
import SaveEventTemplate from "../../../component/Events/saveEvent";
import SideBarNav from "../../pageAssets/SideBarNav";
import SuggestedOrganizer from "../../../component/Suggested_organizer/suggestedOrganizer";
import SEO from "../../../component/SEO";

export default function SaveEvents() {
  return (
    <>
      <SEO
        title="Saved Events - Your Favorite Events"
        description="View and manage your saved events at Zagasm Studios. Keep track of concerts, festivals, parties and events you're interested in attending."
        keywords="zagasm studios, saved events, favorite events, bookmarked events, upcoming events"
      />
      <div className="">
        <div className="tw:w-full tw:min-h-screen tw:bg-[#F5F5F7] tw:pt-2 tw:md:pt-24 tw:lg:px-4">
          <div className="">
            <div className="col pb-5 mb-5 mt-4">
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
