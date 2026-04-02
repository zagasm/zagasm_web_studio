import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBarNav from "../../pageAssets/SideBarNav";
import "./interestStyling.css";

import { api, authHeaders } from "../../../lib/apiClient";
import { useAuth } from "../../auth/AuthContext";
import {
  ToastHost,
  showPromise,
  showSuccess,
  showError,
} from "../../../component/ui/toast";

// Optional: keep your local icon set as fallbacks if API returns images later
import music_icon from "../../../assets/navbar_icons/music_icon.png";
import church_icon from "../../../assets/navbar_icons/church_icon.png";
import mosque from "../../../assets/navbar_icons/mosque.png";
import cultural_icon from "../../../assets/navbar_icons/cultural_icon.png";
import gospel_icon from "../../../assets/navbar_icons/gospel_icon.png";
import notification_icon from "../../../assets/navbar_icons/notification_icon.png";
import webinar_icon from "../../../assets/navbar_icons/webinar_icon.png";
import masterclass_icon from "../../../assets/navbar_icons/masterclass_icon.png";
import photo_icon from "../../../assets/navbar_icons/photo_icon.png";
import afrobeat_icon from "../../../assets/navbar_icons/afrobeat_icon.png";

/** Simple color palette to style pills without changing your layout */
const PALETTE = [
  "rgba(255, 59, 48, 1)", // red
  "rgba(52, 199, 89, 1)", // green
  "rgba(50, 173, 230, 1)", // blue
  "rgba(175, 82, 222, 1)", // purple
  "rgba(88, 86, 214, 1)", // indigo
  "rgba(255, 204, 0, 1)", // yellow
  "rgba(255, 149, 0, 1)", // orange
  "rgba(0, 199, 190, 1)", // teal
];

/** Optional local fallback icons by keyword */
const FALLBACK_ICONS = {
  Music: music_icon,
  Church: church_icon,
  Mosque: mosque,
  Cultural: cultural_icon,
  Gospel: gospel_icon,
  Politics: notification_icon,
  Webinar: webinar_icon,
  Masterclass: masterclass_icon,
  Photography: photo_icon,
  Afrobeats: afrobeat_icon,
};

function AccountInterest() {
  const navigate = useNavigate();
  const { token } = useAuth();

  // server interests
  const [items, setItems] = useState([]); // [{id, name, emoji, image, ...style}]
  const [loading, setLoading] = useState(true);

  // selected = array of IDs (because backend expects IDs)
  const [selectedInterests, setSelectedInterests] = useState([]);

  // fetch interests
  useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        setLoading(true);
        const req = api.get("/api/v1/interests", authHeaders(token));
        const res = await req;

        const server = res?.data?.interests || [];

        // Map server data to your current button style config (no layout change)
        const mapped = server.map((it, i) => {
          const color = PALETTE[i % PALETTE.length];
          return {
            id: it.id,
            name: it.name,
            emoji: it.emoji,
            image: it.image, // may be null
            borderColor: color,
            bgColor: "white", // <-- always white background
            textColor: color, // <-- text matches the border color
            fallbackIcon:
              FALLBACK_ICONS[
                Object.keys(FALLBACK_ICONS).find((k) =>
                  it.name?.toLowerCase().includes(k.toLowerCase())
                ) || ""
              ],
          };
        });

        if (mounted) setItems(mapped);
      } catch (e) {
        // toast already shown by showPromise
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [token]);

  const toggleInterest = (interestId) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  // keep your exact styling logic, just use mapped item
  const getButtonStyle = (interest) => {
    const isSelected = selectedInterests.includes(interest.id);
    const isWhiteBg = interest.bgColor === "white";

    if (isSelected) {
      return {
        color: isWhiteBg ? "white" : interest.textColor,
        backgroundColor: isWhiteBg ? interest.borderColor : "white",
        border: `1px solid ${interest.borderColor}`,
      };
    }
    return {
      color: interest.textColor,
      backgroundColor: interest.bgColor,
      border: `1px solid ${interest.borderColor}`,
    };
  };

  const handleSave = async () => {
    if (selectedInterests.length === 0) return;

    const data = new FormData();
    // interests[0]=id, interests[1]=id, ...
    selectedInterests.forEach((id, idx) =>
      data.append(`interests[${idx}]`, id)
    );

    const req = api.post(
      "/api/v1/user/interests/save",
      data,
      authHeaders(token)
    );

    try {
      const res = await showPromise(req, {
        loading: "Saving your interests…",
        success: "Interests saved successfully",
        error: "Failed to save interests",
      });

      if (res?.data?.status) {
        navigate(-1); // go back after save
      }
    } catch (e) {
      // toast already handled
    }
  };

  const headerSubtitle = useMemo(() => {
    if (selectedInterests.length === 0)
      return "Select some interests to help personalize your experience";
    if (selectedInterests.length === 1) return "1 interest selected";
    return `${selectedInterests.length} interests selected`;
  }, [selectedInterests]);

  return (
    <div className="container-fluid m-0 p-0">
      <ToastHost />
      <SideBarNav />
      <div className="page_wrapper overflow-hidden">
        <div className="row p-0">
          <div className="col interest_section">
            <div className="container">
              <div className="tw:space-y-3 tw:mb-4 tw:px-2">
                <span className="tw:text-3xl tw:md:text-4xl tw:font-bold">
                  Interest
                </span>
                <span className="tw:block tw:text-gray-500">
                  {headerSubtitle}
                </span>
              </div>

              {/* keep your container + buttons */}
              <div className="interest_container tw:px-2">
                {loading ? (
                  <div className="tw:text-sm tw:text-gray-500">Loading…</div>
                ) : (
                  items.map((interest) => (
                    <button
                      key={interest.id}
                      className="interest-button d-flex align-items-center tw:gap-2"
                      style={getButtonStyle(interest)}
                      onClick={() => toggleInterest(interest.id)}
                      onMouseEnter={(e) => {
                        if (!selectedInterests.includes(interest.id)) {
                          const isWhiteBg = interest.bgColor === "white";
                          e.currentTarget.style.color = isWhiteBg
                            ? "white"
                            : interest.textColor;
                          e.currentTarget.style.backgroundColor = isWhiteBg
                            ? interest.borderColor
                            : "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selectedInterests.includes(interest.id)) {
                          e.currentTarget.style.color = interest.textColor;
                          e.currentTarget.style.backgroundColor =
                            interest.bgColor;
                        }
                      }}
                    >
                      {/* prefer API image; else emoji; else fallback icon */}
                      {interest.image ? (
                        <img
                          src={interest.image}
                          alt={interest.name}
                          width="16"
                          height="16"
                        />
                      ) : interest.emoji ? (
                        <span style={{ fontSize: 14, lineHeight: 1 }}>
                          {interest.emoji}
                        </span>
                      ) : interest.fallbackIcon ? (
                        <img
                          src={interest.fallbackIcon}
                          alt={interest.name}
                          width="16"
                          height="16"
                        />
                      ) : null}
                      {interest.name}
                    </button>
                  ))
                )}
              </div>

              <div className="interest_footer tw:px-2">
                <div className="skip_btn">
                  <span
                    role="button"
                    onClick={() => navigate(-1)} // SKIP: go back
                  >
                    Skip for now
                  </span>
                </div>
                <div className="save_btn">
                  <button
                    className={selectedInterests.length > 0 ? "active" : ""}
                    disabled={selectedInterests.length === 0}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountInterest;
