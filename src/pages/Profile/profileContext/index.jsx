import React, { createContext, useContext, useState, useEffect } from "react";
import { showToast } from "../../../component/ToastAlert";
import { useAuth } from "../../auth/AuthContext";

const ProfileContext = createContext();

export const ProfileProvider = ({ children, user }) => {
  const [message, setMessage] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [ProfileData, setProfileData] = useState(null);
  const {user_id} = useAuth();

  const fetchProfileById = async (profileId) => {
    setIsProfileLoading(true);
    setMessage(null);

    try {
      const formPayload = new FormData();
      formPayload.append("api_secret_key", import.meta.env.VITE_API_SECRET || "Zagasm2025!Api_Key_Secret");
      formPayload.append("profile_id", profileId);
      formPayload.append("viewer_id", user_id || "");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/includes/ajax/users/get_profile.php`, {
        method: "POST",
        body: formPayload,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
          setProfileData(response);
    //   if (data?.profile) {
    //     return data.profile;
    //   } else {
    //     throw new Error("No profile data found");
    //   }
    } catch (error) {
      const errMsg = error.message || "Failed to load profile";
      setMessage({ type: "error", message: errMsg });
      showToast.error(errMsg);
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Load the user's own profile when the context mounts (if user is logged in)
  useEffect(() => {
    if (user_id) {
      fetchProfileById(user_id);
    }
  }, [user_id]);

  return (
    <ProfileContext.Provider value={{ ProfileData, fetchProfileById, isProfileLoading, message }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);