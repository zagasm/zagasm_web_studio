// ProfileHeader.jsx
import React, { useEffect, useState } from "react";
import { Navigate, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../pageAssets/Navbar';
import default_profilePicture from '../../assets/avater_pix.avif';
import { FiEdit, FiCamera } from 'react-icons/fi';
import './Profilestyle.css';
import ShimmerLoader from '../../component/assets/Loader/profileHeaderLoader';
import { useAuth } from "../auth/AuthContext";
import FollowModal from "./followModal";

function ProfileHeader() {
    const location = useLocation();
    const { user } = useAuth();
    const { profileId } = useParams();
    const navigate = useNavigate();

    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    
    // Add these states for modals
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
    const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);

    const fetchProfileById = async (profileId) => {
        setIsProfileLoading(true);
        setError(null);

        try {
            const formPayload = new FormData();
            formPayload.append("api_secret_key", import.meta.env.VITE_API_SECRET || "Zagasm2025!Api_Key_Secret");
            formPayload.append("profile_id", profileId);
            formPayload.append("viewer_id", user?.user_id || "");

            const response = await fetch(`${import.meta.env.VITE_API_URL}/includes/ajax/users/get_profile.php`, {
                method: "POST",
                body: formPayload,
                credentials: "include",
            });

            // if (!response.ok) {
            //     navigate("/page-not-found");
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }

            const data = await response.json();

            if (data?.profile) {
                setProfileData(data.profile);
            } else {
                throw new Error("No profile data found");
                navigate("/page-not-found");
            }
        } catch (error) {
            setError(error.message || "Failed to load profile");
            console.error("Profile fetch error:", error);
        } finally {
            setIsProfileLoading(false);
        }
    };

    // Add this function to fetch followers
    const fetchFollowers = async () => {
        setIsLoadingFollowers(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/includes/ajax/users/get_followers.php`, {
                method: "POST",
                body: new FormData().append("user_id", profileId),
                credentials: "include",
            });
            const data = await response.json();
            if (data.followers) {
                setFollowers(data.followers.map(f => ({
                    id: f.user_id,
                    name: `${f.user_firstname} ${f.user_lastname}`,
                    username: f.user_name,
                    avatar: f.user_picture
                })));
            }
        } catch (error) {
            console.error("Error fetching followers:", error);
        } finally {
            setIsLoadingFollowers(false);
        }
    };

    // Add this function to fetch following
    const fetchFollowing = async () => {
        setIsLoadingFollowing(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/includes/ajax/users/get_following.php`, {
                method: "POST",
                body: new FormData().append("user_id", profileId),
                credentials: "include",
            });
            const data = await response.json();
            if (data.following) {
                setFollowing(data.following.map(f => ({
                    id: f.user_id,
                    name: `${f.user_firstname} ${f.user_lastname}`,
                    username: f.user_name,
                    avatar: f.user_picture
                })));
            }
        } catch (error) {
            console.error("Error fetching following:", error);
        } finally {
            setIsLoadingFollowing(false);
        }
    };

    // Add these handlers for modal toggles
    const handleFollowersClick = () => {
        setShowFollowersModal(true);
        fetchFollowers();
    };

    const handleFollowingClick = () => {
        setShowFollowingModal(true);
        fetchFollowing();
    };

    useEffect(() => {
        if (profileId) {
            fetchProfileById(profileId);
        }
    }, [profileId]);

    if (isProfileLoading) return <ShimmerLoader />;
    if (error) return <div style={{ paddingTop: '300px' }}>{error}</div>;
    if (!profileData) return <div style={{ paddingTop: '300px' }}>Unable to retrieve user profile details.</div>;

    const profile = profileData;
    const profileImage = profile.user_picture || default_profilePicture;
    const fullName = `${profile.user_firstname} ${profile.user_lastname}`.trim() || "Anonymous User";
    const username = profile.user_name ? `@${profile.user_name}` : "";
    const birthdate = profile.user_birthdate ? new Date(profile.user_birthdate).toLocaleDateString() : "Not specified";
    const gender = profile.user_gender === "1" ? "Male" : profile.user_gender === "2" ? "Female" : "Not specified";

    return (
        <div className="profile-wrapper">
            <Navbar />

            {/* ... (your existing cover photo and profile info code) ... */}

            {/* Update the stats section to make followers/following clickable */}
            <div className="profile-stats d-flex justify-content-center justify-content-md-start m-0 p-0">
                <div className="stat-item text-center">
                    <span className='fa fa-image profile_icon'></span>
                    <div>
                        <span className="stat-number">{profile.post_count || 0}</span>
                        <span className="stat-label">Posts</span>
                    </div>
                </div>

                <div className="stat-item text-center clickable" onClick={handleFollowersClick}>
                    <span className='fa fa-users profile_icon'></span>
                    <div>
                        <span className="stat-number">{profile.followers_count || 0}</span>
                        <span className="stat-label">Followers</span>
                    </div>
                </div>
                
                <div className="stat-item text-center clickable" onClick={handleFollowingClick}>
                    <span className='fa fa-user-plus profile_icon'></span>
                    <div>
                        <span className="stat-number">{profile.following_count || 0}</span>
                        <span className="stat-label">Following</span>
                    </div>
                </div>
            </div>

            {/* Add the modals at the bottom of your component */}
            <FollowModal
                visible={showFollowersModal}
                onClose={() => setShowFollowersModal(false)}
                title="Followers"
                data={followers}
                loading={isLoadingFollowers}
            />
            
            <FollowModal
                visible={showFollowingModal}
                onClose={() => setShowFollowingModal(false)}
                title="Following"
                data={following}
                loading={isLoadingFollowing}
            />
        </div>
    );
}

export default ProfileHeader;