import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../pageAssets/Navbar';
import default_profilePicture from '../../assets/avater_pix.avif';
import { FiEdit, FiCamera, FiMessageSquare } from 'react-icons/fi';
import './Profilestyle.css';
import ShimmerLoader from '../../component/assets/Loader/profileHeaderLoader';
import { useAuth } from "../auth/AuthContext";
import FollowModal from './followModal'; // Make sure this path is correct
import Edit_icon from '../../assets/Profile_icon/Edit_icon.png';
import post_icon from '../../assets/Profile_icon/post_icon.png';
import followers_icon from '../../assets/Profile_icon/followers_icon.png';
import user_icon from '../../assets/Profile_icon/user_icon.png';
// import EditProfileModal from "./EditProfile";

function ProfileHeader() {
    const { user } = useAuth();
    const { profileId } = useParams();
    const navigate = useNavigate();
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    // Modal states
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

            if (!response.ok) {
                navigate("/page-not-found");
                throw new Error(`HTTP error! status: ${response.status}`);
            }

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

    const fetchFollowers = async () => {
        setIsLoadingFollowers(true);
        try {
            const formData = new FormData();
            formData.append("user_id", profileId);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/includes/ajax/users/get_followers.php`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await response.json();
            if (data.followers) {
                setFollowers(data.followers.map(f => ({
                    id: f.user_id,
                    name: `${f.user_firstname} ${f.user_lastname}`,
                    username: f.user_name,
                    avatar: f.user_picture || default_profilePicture
                })));
            }
        } catch (error) {
            console.error("Error fetching followers:", error);
        } finally {
            setIsLoadingFollowers(false);
        }
    };

    const fetchFollowing = async () => {
        setIsLoadingFollowing(true);
        try {
            const formData = new FormData();
            formData.append("user_id", profileId);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/includes/ajax/users/get_following.php`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await response.json();
            if (data.following) {
                setFollowing(data.following.map(f => ({
                    id: f.user_id,
                    name: `${f.user_firstname} ${f.user_lastname}`,
                    username: f.user_name,
                    avatar: f.user_picture || default_profilePicture
                })));
            }
        } catch (error) {
            console.error("Error fetching following:", error);
        } finally {
            setIsLoadingFollowing(false);
        }
    };

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
    const profileImage = default_profilePicture;
    // const profileImage = 'https://zagasm.com/content/uploads/' + profile.user_picture || default_profilePicture;
    const fullName = `${profile.user_firstname} ${profile.user_lastname}`.trim() || "Anonymous User";
    const username = profile.user_name ? `@${profile.user_name}` : "";
    return (
        <div className="profile-wrapper">
            <Navbar />
            <div className="cover-photo-container">
                <div className="cover-photo" >
                    {user?.user_id === profileId && (
                        <div className="cover-photo-actions">
                            <Link to={'/settings'} className="cover-action-btn" >
                                Edit Profile
                                <img className="" src={Edit_icon} alt="" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="mobile-container">
                <div className="profile-info-section bg-whit shadow-sm">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="profile-header d-flex flex-column flex-md-row align-items-center py-3">
                                    <div className="profile-picture-container mb-3 mb-md-0 mx-auto mx-md-0">
                                        <div className="profile-picture-wrapper">
                                            <img
                                                className="profile-picture"
                                                src={profileImage}
                                                alt="Profile"
                                            />
                                            {user?.user_id === profileId && (
                                                <div className="profile-picture-action">
                                                    <FiCamera />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="profile-details">
                                        <h2 className="profile-name m-0 p-0 text-capitalize">{fullName}</h2>
                                        {username && <p className="profile-username mb-2 p-0">{username}</p>}

                                        <div className="profile-stats d-flex justify-content-center justify-content-md-start m-0 p-0">
                                            <div className="stat-item text-center">
                                                <span className='fa fa-imag profile_icon'><img src={post_icon} alt="" /></span>
                                                <div>
                                                    <span className="stat-number">{profile.post_count || 0}</span>
                                                    <span className="stat-label">Posts</span>
                                                </div>
                                            </div>
                                            <div className="stat-item text-center clickable" onClick={handleFollowersClick}>
                                                <span className='fa fa-use profile_icon'><img src={followers_icon} alt="" /></span>
                                                <div>
                                                    <span className="stat-number">{profile.followers_count || 0}</span>
                                                    <span className="stat-label">Followers</span>
                                                </div>
                                            </div>
                                            <div className="stat-item text-center clickable" onClick={handleFollowingClick}>
                                                <span className='fa fa-user-plu profile_icon'><img src={user_icon} alt="" /></span>
                                                <div>
                                                    <span className="stat-number">{profile.following_count || 0}</span>
                                                    <span className="stat-label">Following</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="profile-actions mt-3 mt-md-0 ml-md-auto text-center">
                                        {user?.user_id === profileId ? (
                                            <Link to={'/settings'} className="btn mr-2 mb-2 mb-md-0 desktop_edit_profile">
                                                <FiEdit className="mr-1" />
                                                Edit Profile
                                            </Link>
                                        ) : (
                                            <>
                                                <button
                                                    className={`btn mr-2 mb-2 mb-md-0 ${profile.i_am_following ? 'btn-secondary' : 'btn-primary'}`}
                                                    onClick={async () => {
                                                        try {
                                                            // Set loading state
                                                            setIsFollowLoading(true);

                                                            const formData = new FormData();
                                                            formData.append("api_secret_key", "Zagasm2025!Api_Key_Secret");
                                                            formData.append("user_id", user?.user_id);
                                                            formData.append("do", profile.i_am_following ? "unfollow" : "follow");
                                                            formData.append("id", profileId);

                                                            const response = await fetch("https://zagasm.com/includes/ajax/users/connect.php", {
                                                                method: "POST",
                                                                body: formData,
                                                                credentials: "include",
                                                            });

                                                            const result = await response.json();

                                                            if (result.success) {
                                                                // Update the profile data to reflect the new follow status
                                                                setProfileData(prev => ({
                                                                    ...prev,
                                                                    i_am_following: !prev.i_am_following,
                                                                    followers_count: prev.i_am_following
                                                                        ? Math.max(0, prev.followers_count - 1)
                                                                        : prev.followers_count + 1
                                                                }));
                                                            } else {
                                                                console.error("Follow action failed:", result.message);
                                                            }
                                                        } catch (error) {
                                                            console.error("Error following user:", error);
                                                        } finally {
                                                            setIsFollowLoading(false);
                                                        }
                                                    }}
                                                    disabled={!user?.user_id || isFollowLoading} // Disable if not logged in or loading
                                                >
                                                    {isFollowLoading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            <span className="sr-only">Loading...</span>
                                                        </>
                                                    ) : (
                                                        profile.i_am_following ? "Following" : "Follow"
                                                    )}
                                                </button>
                                                <Link to={'/chat/' + profileId} className="btn mr-2 mb-2 mb-md-0"
                                                    style={{
                                                        background: 'none',
                                                        color: '#8000FF',
                                                        border: '1px solid #8000FF'
                                                    }}
                                                >
                                                    <FiMessageSquare className="mr-1" />
                                                    Message
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <FollowModal
                    visible={showFollowersModal}
                    onClose={() => setShowFollowersModal(false)}
                    title="Followers"
                    type="followers"
                    profileId={profileId}
                    viewerId={user.user_id}
                    size="lg"
                />

                <FollowModal
                    visible={showFollowingModal}
                    onClose={() => setShowFollowingModal(false)}
                    title="Following"
                    type="following"
                    profileId={profileId}
                    viewerId={user.user_id}
                    size="lg"
                />
            </div>
        </div>
    );
}
export default ProfileHeader;