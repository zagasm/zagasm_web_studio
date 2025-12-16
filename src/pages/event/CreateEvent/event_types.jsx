import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./eventTypeStyling.css";

function EventType() {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, token } = useAuth();
  const navigate = useNavigate();
  console.log("User info in EventType:", user);

  const isOrganiser =
    user?.is_organiser_verified ||
    user?.roles?.includes("organiser") ||
    user?.roles?.includes("organizer");

  // console.log("Is Organiser:", user);

  const kycStatus = user?.kyc?.status || null;
  const isKycVerified = kycStatus === "verified";

  const shouldShowBecomeOrganiser = !isOrganiser && !isKycVerified;

  useEffect(() => {
    if (shouldShowBecomeOrganiser) {
      setLoading(false);
      return;
    }

    const fetchEventTypes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/event/type/view`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const uniqueEvents = Array.from(
          new Set(response.data.events.map((e) => e.name))
        ).map((name) => response.data.events.find((e) => e.name === name));

        setEventTypes(uniqueEvents);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load event types");
        setLoading(false);
      }
    };

    fetchEventTypes();
  }, [token, shouldShowBecomeOrganiser]);

  if (loading) {
    return (
      <div className="tw:w-full tw:min-h-screen tw:bg-[#F5F5F7] tw:flex tw:items-center tw:justify-center">
        <span className="tw:block">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw:w-full tw:min-h-screen tw:bg-[#F5F5F7] tw:flex tw:items-center tw:justify-center">
        <span className="tw:block tw:text-red-500">Error: {error}</span>
      </div>
    );
  }

  // 1) NOT organiser + KYC not verified → "Become an Organizer"
  if (shouldShowBecomeOrganiser) {
    return (
      <div className="tw:w-full tw:min-h-screen tw:bg-[#F5F5F7] tw:pt-20 tw:md:pt-24 tw:px-4 tw:lg:px-4">
        <div className="tw:bg-white tw:w-full tw:md:max-w-xl tw:mx-auto tw:mt-10 tw:rounded-3xl tw:px-4 tw:py-3">
          <div className="tw:flex tw:flex-col tw:items-center tw:justify-center">
            <div className="tw:size-[114px] tw:rounded-full tw:overflow-hidden">
              <img
                src={user?.profileUrl || "/images/avater_pix.avif"}
                alt=""
                className="tw:w-full tw:h-full tw:object-cover"
              />
            </div>
            <div className="tw:mt-1 tw:text-center">
              <span className="tw:block tw:font-semibold tw:text-[16px]">
                {user?.name}
              </span>
              <span className="tw:block tw:text-xs">{user?.email}</span>
            </div>
            <div className="tw:bg-[#f5f5f5] tw:relative tw:px-4 tw:py-3 tw:rounded-2xl tw:mt-6 tw:w-full">
              <div>
                <span className="tw:block tw:text-xs">Following</span>
                <span className="tw:block tw:font-semibold tw:text-[20px]">
                  {user?.followings_count ?? 0}
                </span>
              </div>
              <img
                className="tw:size-3 tw:absolute tw:top-4 tw:right-4"
                src="/images/arrowrightbend.png"
                alt=""
              />
            </div>
          </div>
        </div>

        <div className="tw:bg-white tw:w-full tw:md:max-w-xl tw:mx-auto tw:mt-2 tw:rounded-2xl tw:px-4 tw:py-3">
          <span className="tw:block tw:font-semibold">About Me</span>
          <span className="tw:block tw:text-xs">{user?.about}</span>
        </div>

        <div className="tw:bg-linear-to-r tw:from-[#8F07E7] tw:via-[#9105B4] tw:to-[#500481] tw:w-full tw:md:max-w-xl tw:mx-auto tw:mt-4 tw:rounded-2xl tw:px-4 tw:py-4 tw:text-center tw:text-white">
          <span className="tw:block tw:font-semibold tw:uppercase tw:text-xl">
            Do you have an event?
          </span>
          <span className="tw:block tw:text-xs">
            You can be an organizer and drive more audience to your event.
            People all over the world can’t wait to attend!!
          </span>

          <Link
            to="/become-an-organiser"
            className="tw:p-3 tw:block tw:bg-white tw:text-black tw:mt-5 tw:rounded-lg tw:text-center"
          >
            <span className="tw:block tw:font-semibold">
              Become an Organizer
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // 2) Organiser but KYC not verified → notice block
  if (isOrganiser && !isKycVerified) {
    return (
      <div className="tw:min-h-screen tw:bg-white tw:flex tw:items-center tw:justify-center tw:px-4 tw:py-10">
        <div className="tw:w-full tw:max-w-xl tw:bg-white tw:rounded-3xl tw:p-6 tw:md:p-8 tw:shadow-[0_18px_60px_rgba(15,23,42,0.18)] tw:space-y-6">
          {/* Top: icon + badge */}
          <div className="tw:flex tw:items-center tw:flex-col tw:gap-4">
            <div className="tw:flex tw:h-12 tw:w-12 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-primary/5">
              <div className="tw:h-6 tw:w-6 tw:rounded-full tw:border-[3px] tw:border-primary tw:border-t-transparent tw:animate-spin" />
            </div>

            <div className="tw:flex-1 tw:text-center">
              <div className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-emerald-50 tw:px-3 tw:py-1">
                <span className="tw:h-2 tw:w-2 tw:rounded-full tw:bg-emerald-500 tw:animate-pulse" />
                <span className="tw:text-[11px] tw:font-semibold tw:tracking-[0.16em] tw:uppercase tw:text-emerald-700">
                  KYC in progress
                </span>
              </div>

              <span className="tw:block tw:mt-3 tw:text-xl tw:md:text-2xl tw:font-semibold tw:text-slate-900">
                Your organiser account is under review
              </span>

              <p className="tw:mt-2 tw:text-sm tw:text-slate-600">
                We&apos;re currently verifying the details you submitted. Once
                your KYC is approved, you&apos;ll unlock organiser tools like
                event creation, payouts and more.
              </p>
            </div>
          </div>

          {/* Progress bar + copy */}
          <div className="tw:rounded-2xl tw:bg-slate-50 tw:px-4 tw:py-4 tw:space-y-3">
            <div className="tw:flex tw:items-center tw:justify-between">
              <span className="tw:text-xs tw:font-medium tw:text-slate-700">
                Verification status
              </span>
              <span className="tw:text-[11px] tw:font-semibold tw:text-slate-500 tw:uppercase tw:tracking-[0.16em]">
                Under review
              </span>
            </div>

            <div className="tw:h-2.5 tw:w-full tw:rounded-full tw:bg-slate-200">
              <div className="tw:h-full tw:w-2/3 tw:rounded-full tw:bg-primary tw:transition-all tw:duration-500" />
            </div>

            <ul className="tw:mt-1 tw:space-y-1.5 tw:text-[12px] tw:text-slate-600">
              <li className="tw:flex tw:items-center tw:gap-2">
                <span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-primary" />
                ID & bank details submitted
              </li>
              <li className="tw:flex tw:items-center tw:gap-2">
                <span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-emerald-400" />
                Our compliance team is reviewing your information
              </li>
              <li className="tw:flex tw:items-center tw:gap-2">
                <span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-slate-300" />
                You&apos;ll be notified once a decision is made
              </li>
            </ul>
          </div>

          {/* Info + actions */}
          <div className="tw:flex tw:flex-col tw:md:flex-row tw:items-start tw:md:items-center tw:justify-between tw:gap-4">
            <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
              <button
                style={{
                  borderRadius: 12,
                }}
                type="button"
                className="tw:inline-flex tw:items-center tw:justify-center tw:rounded-full tw:border tw:border-slate-200 tw:px-4 tw:py-2 tw:text-xs tw:font-medium tw:text-slate-700 tw:hover:bg-slate-50 tw:transition"
                // onClick={() => navigate("/")} // if you have useNavigate
              >
                Go to home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3) Organiser + KYC verified → modern card grid for event types
  return (
    <div className="tw:font-sans tw:w-full tw:min-h-screen tw:bg-[#F5F5F7] tw:py-24 tw:md:pt-28 tw:px-4 tw:lg:px-4">
      <div className="tw:max-w-7xl tw:mx-auto">
        <div className="tw:flex tw:flex-col tw:gap-2 tw:mb-6">
          <span className="tw:block tw:text-2xl tw:md:text-3xl tw:font-semibold">
            Select Event Type
          </span>
          <span className="tw:block tw:font-medium">
            What type of events are you creating?
          </span>
          <span className="tw:block tw:text-xs tw:text-gray-600">
            This helps us customize your event setup and tools for you.
          </span>
        </div>

        {eventTypes.length === 0 ? (
          <div className="tw:w-full tw:mt-10 tw:flex tw:items-center tw:justify-center">
            <div className="tw:bg-white tw:rounded-2xl tw:px-6 tw:py-8 tw:max-w-md tw:text-center tw:shadow-sm">
              <span className="tw:text-sm tw:font-semibold tw:mb-2">
                No event types available yet
              </span>
              <span className="tw:text-xs tw:text-gray-600">
                Please check back later or contact support if you think this is
                a mistake.
              </span>
            </div>
          </div>
        ) : (
          <div className="tw:mt-6 tw:grid! tw:grid-cols-1 tw:sm:grid-cols-3 tw:lg:grid-cols-4 tw:gap-4 tw:pb-10">
            {eventTypes.map((event) => (
              <button
                style={{
                  borderRadius: 16,
                }}
                key={event.id}
                type="button"
                onClick={() => navigate(`/event/create-event/${event.id}`)}
                className="tw:group tw:relative tw:w-full tw:rounded-2xl tw:bg-white tw:p-4 tw:text-left tw:shadow-sm tw:border tw:border-[#f0f0f3] tw:hover:border-[#8F07E7] tw:hover:shadow-md tw:transition tw:duration-200 tw:flex tw:flex-col tw:gap-3"
              >
                <div className="tw:flex tw:items-center tw:justify-between tw:gap-3">
                  <div className="tw:flex tw:items-center tw:gap-3">
                    <div className="tw:flex tw:h-10 tw:w-10 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#F4E6FD] tw:text-[#ffffff] tw:text-sm tw:font-semibold">
                      {/* {event.name?.[0]?.toUpperCase()} */}
                      <img src={event.icon_url} alt="" />
                    </div>
                    <div>
                      <span className="tw:text-sm tw:font-semibold">
                        {event.name}
                      </span>
                      <span className="tw:block tw:text-[11px] tw:text-gray-500 tw:mt-0.5">
                        Click to create a {event.name?.toLowerCase()} event.
                      </span>
                    </div>
                  </div>

                  <span className="tw:inline-flex tw:h-8 tw:w-8 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#F5F5F7] tw:text-xs tw:text-gray-500 group-tw:hover:bg-[#8F07E7] group-tw:hover:text-white tw:transition tw:duration-200">
                    →
                  </span>
                </div>

                <div className="tw:flex tw:items-center tw:justify-between tw:mt-2">
                  <span className="tw:inline-flex tw:px-2 tw:py-1 tw:rounded-full tw:bg-[#F5F5F7] tw:text-[10px] tw:font-medium tw:text-gray-600">
                    Event type
                  </span>
                  <span className="tw:text-[10px] tw:text-gray-400">
                    Tap to continue
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventType;
