// src/page/Home/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import EventTemplate from "../../component/Events/SingleEvent";
import MobileSingleOrganizers from "../../component/Organizers/ForMobile/OrganisersForYou";
import SEO from "../../component/SEO";
import { Link } from "react-router-dom";
import "./Homestyle.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const [showOrganizers, setShowOrganizers] = useState(false);
  const eventsScrollRef = useRef(null);

  useEffect(() => {
    const area = eventsScrollRef.current;
    if (!area) return;

    const onScroll = () => {
      if (area.scrollTop > 20) setShowOrganizers(true);
    };

    area.addEventListener("scroll", onScroll);
    return () => area.removeEventListener("scroll", onScroll);
  }, []);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);

    if (eventsScrollRef.current) {
      eventsScrollRef.current.scrollTop = 0;
    }

    setShowOrganizers(false);
  };

  return (
    <>
      <SEO title="Discover Events - Xilolo" />

      <div className="tw:w-full tw:min-h-screen tw:bg-white tw:pt-24 tw:md:pt-24 tw:px-2 tw:font-sans">
        <span className="tw:text-3xl tw:font-bold tw:block tw:mb-8">
          Discover events
        </span>
        {/* TABS */}
        <div className="tw:flex tw:gap-3 tw:mb-6">
          <button
            onClick={() => handleTabChange("all")}
            className={`tw:px-6 tw:py-2 tw:rounded-xl tw:text-sm tw:font-medium ${activeTab === "all"
                ? "tw:bg-primary tw:text-white"
                : "tw:bg-[#ffffff] tw:text-gray-500 tw:border tw:border-gray-200"
              }`}
          >
            All
          </button>
          <button
            onClick={() => handleTabChange("upcoming")}
            className={`tw:px-6 tw:py-2 tw:rounded-xl tw:text-sm tw:font-medium ${activeTab === "upcoming"
                ? "tw:bg-primary tw:text-white"
                : "tw:bg-[#ffffff] tw:text-gray-500 tw:border tw:border-gray-200"
              }`}
          >
            Trending
          </button>
          <button
            onClick={() => handleTabChange("live")}
            className={`tw:px-6 tw:py-2 tw:rounded-xl tw:text-sm tw:font-medium ${activeTab === "live"
                ? "tw:bg-primary tw:text-white"
                : "tw:bg-[#ffffff] tw:text-gray-500 tw:border tw:border-gray-200"
              }`}
          >
            Live
          </button>

        </div>

        {/* SCROLL AREA */}
        <div
          ref={eventsScrollRef}
          className="tw:-mt-6 tw:h-[calc(100vh-120px)] tw:overflow-y-auto tw-no-scrollbar tw:pr-1 tw:pb-20"
        >
          <EventTemplate
            endpoint={
              activeTab === "live"
                ? "/api/v1/events/view/live"
                : activeTab === "all"
                  ? "/api/v1/events/all/get"
                  : "/api/v1/events"
            }
            live={activeTab === "live"}
            upcoming={activeTab === "upcoming"}
            all={activeTab === "all"}
          />

          {showOrganizers && (
            <div className="tw:mt-12">
              <div className="tw:flex tw:justify-between tw:px-2 tw:mb-3">
                <small className="tw:font-semibold">
                  Organizers you may know
                </small>
                <Link to="/organizers" className="tw:text-sm tw:text-black">
                  View all
                </Link>
              </div>
              <MobileSingleOrganizers />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
