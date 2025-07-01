import React, { useState, useEffect } from "react";
import axios from "axios";
import default_profilePicture from '../../../assets/avater_pix.avif';
import './FollowModal.css';

const FollowModal = ({
    visible,
    onClose,
    title,
    type, // 'followers' or 'following'
    profileId,
    viewerId,
    noResultsText = "No users found",
    size = "md"
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const handleFollow = async (followUserId, currentFollowingStatus) => {
        try {
            const formData = new FormData();
            formData.append("api_secret_key", "Zagasm2025!Api_Key_Secret");
            formData.append("user_id", viewerId);
            formData.append("do", currentFollowingStatus ? "unfollow" : "follow");
            formData.append("id", followUserId);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/includes/ajax/users/connect.php`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const result = await response.json();

            if (result.success) {
                // Update the data state to reflect the new follow status
                setData(prev => prev.map(user =>
                    user.user_id === followUserId
                        ? { ...user, i_am_following: !currentFollowingStatus }
                        : user
                ));
                setFilteredData(prev => prev.map(user =>
                    user.user_id === followUserId
                        ? { ...user, i_am_following: !currentFollowingStatus }
                        : user
                ));

                // Show success message
                console.log(result.message);
            } else {
                console.error("Follow action failed:", result.message);
            }
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    const fetchData = async (reset = false) => {
        if (loading) return;

        setLoading(true);
        const currentOffset = reset ? 0 : offset;

        try {
            const formData = new FormData();
            formData.append("api_secret_key", "Zagasm2025!Api_Key_Secret");
            formData.append("profile_id", profileId);
            formData.append("offset", '0');
            formData.append("viewer_id", viewerId);

            const endpoint = type === 'followers'
                ? `${import.meta.env.VITE_API_URL}/includes/ajax/users/get_followers.php`
                : `${import.meta.env.VITE_API_URL}/includes/ajax/users/get_following.php`;

            const response = await axios.post(endpoint, formData, {
                withCredentials: true
            });

            const result = response.data;
            console.log(result);

            if (result.success) {
                const newData = type === 'followers' ? result.followers : result.following;
                setData(prev => reset ? newData : [...prev, ...newData]);
                setFilteredData(prev => reset ? newData : [...prev, ...newData]);
                setHasMore(newData.length >= 10); // Assuming 10 items per page
                setOffset(reset ? 10 : currentOffset + 10);
            }
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchData(true);
        }
    }, [visible, type]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter(user => {
                const searchTerm = searchQuery.toLowerCase();
                return (
                    user.user_name?.toLowerCase().includes(searchTerm) ||
                    user.user_firstname?.toLowerCase().includes(searchTerm) ||
                    user.user_lastname?.toLowerCase().includes(searchTerm)
                );
            });
            setFilteredData(filtered);
        }
    }, [searchQuery, data]);

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollHeight - scrollTop === clientHeight && hasMore && !loading) {
            fetchData();
        }
    };

    if (!visible) return null;

    const modalSizeClass = size === "lg" ? "modal-lg" : "";

    return (
        <div className="modal-overlay" style={{  zIndex: '99999999999999999999999999'}}>
            <div className={`follow-modal ${modalSizeClass}`}>
                <div className="modal-header p-3" style={{  zIndex: '99999999999999999999999999'}}>
                    <h3>{title}</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="search-container" >
                    <input
                        type="text"
                        placeholder="Search by name or username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        // autoFocus
                        className="search-input"
                    />
                </div>

                <div className="users-list" onScroll={handleScroll}>
                    {loading && offset === 0 ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="no-results">{noResultsText}</div>
                    ) : (
                        filteredData.map(user => (
                            <div key={user.user_id} className="user-item">
                                <img
                                    src={user.user_picture || default_profilePicture}
                                    alt="User avatar"
                                    className="user-avatar"
                                    onError={(e) => {
                                        e.target.src = default_profilePicture;
                                    }}
                                />
                                <div className="user-info">
                                    <div className="user-name">
                                        {user.user_firstname} {user.user_lastname}
                                    </div>
                                    <div className="user-username">@{user.user_name}</div>
                                </div>
                                {user.user_id !== viewerId && (
                                    <button
                                        className={`follow-btn ${user.i_am_following ? 'following' : ''}`}
                                        onClick={() => handleFollow(user.user_id, user.i_am_following)}
                                    >
                                        {user.i_am_following ? 'Following' : 'Follow'}
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                    {loading && offset > 0 && (
                        <div className="loading-more">
                            <div className="spinner"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowModal;
