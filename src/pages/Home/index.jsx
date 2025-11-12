import React, { useState } from "react";
import SideBarNav from "../pageAssets/SideBarNav";
import live_camera from "../../assets/navbar_icons/solar_stream-broken.svg";
import "./Homestyle.css";
import RightBarComponent from "../../component/RightBarComponent";
import EventTemplate from "../../component/Events/SingleEvent";
import SuggestedOrganizer from "../../component/Suggested_organizer/suggestedOrganizer";
import MobileSingleOrganizers from "../../component/Organizers/ForMobile";
import { Link } from "react-router-dom";
import SEO from "../../component/SEO";
import { OrganizationStructuredData } from "../../component/SEO/StructuredData";

function Home() {
  const [activeTab, setActiveTab] = useState("ForYou");

  const ENDPOINTS = {
    ForYou: "/api/v1/events",
    Live: "/api/v1/events/view/live",
  };

  return (
    <>
      <SEO
        title="Home - Discover Amazing Events"
        description="Explore trending events, connect with top organizers, and discover entertainment at Zagasm Studios. Find concerts, parties, festivals, and more in your area."
        keywords="zagasm studios, events near me, discover events, trending events, concert tickets, party events, entertainment, live shows, event discovery, event platform"
      />
      <OrganizationStructuredData />

      <div className="container-flui m-0 p-0">
        <SideBarNav />

        {/* Page wrapper is now a locked viewport area (no window scroll) */}
        <div className="page_wrapper with-fixed-nav">
          <div className="row p-0 h-100 ">
            {/* Main feed column */}
            <div className="col d-flex flex-column h-100">
              {/* Local scroll shell that owns its own scroll */}
              <div className="scroll-shell">
                {/* Sticky tab holder INSIDE the scroll area */}
                <div className="heading_tab_sticky tw:md:pt-4">
                  <div className="shadow-s mb-0 p-0">
                    <div className="heading_tab_container">
                      <button
                        className={`tab ${
                          activeTab === "ForYou" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("ForYou")}
                      >
                        For You
                      </button>

                      <button
                        className={`tab tw:flex tw:gap-2 ${
                          activeTab === "Live" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("Live")}
                        style={{ color: "red" }}
                      >
                        <span>Live</span>
                        <img src={live_camera} alt="" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scrollable feed content */}
                <div className="feed-scroll">
                  <div className="col mobile_organizer">
                    <div className="d-flex justify-content-between p-1">
                      <small>
                        <b>Organizers you may know</b>
                      </small>
                      <Link to={"/organizers"}>View all</Link>
                    </div>
                    <MobileSingleOrganizers />
                  </div>

                  {activeTab === "ForYou" ? (
                    <div className="row">
                      <EventTemplate endpoint={ENDPOINTS.ForYou} />
                    </div>
                  ) : (
                    <div className="row">
                      <EventTemplate endpoint={ENDPOINTS.Live} live />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right bar remains beside; it won’t scroll the window */}
            <RightBarComponent>
              <SuggestedOrganizer />
            </RightBarComponent>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
