import React, { useState } from 'react';
import { Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import SideBarNav from '../pageAssets/sideBarNav.jsx';
import RightBarComponent from '../pageAssets/rightNav.jsx';
import SuggestedFriends from '../../component/Friends/suggestedFriends.jsx';
import './exploreSTyle.css';
import { useAuth } from '../auth/AuthContext/index.jsx';
import default_profilePicture from '../../assets/avater_pix.avif';

const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
};

function ExplorePage() {
    const [query, setQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingFollow, setLoadingFollow] = useState(null);
    const { user } = useAuth();

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === '') {
            setFilteredResults([]);
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('api_secret_key', 'Zagasm2025!Api_Key_Secret');
        formData.append('user_id', user.user_id);
        formData.append('query', value);

        try {
            const response = await axios.post(
                'https://zagasm.com/includes/ajax/users/search.php',
                formData,
                { withCredentials: true }
            );

            if (response.data.success) {
                setFilteredResults(response.data.results);
            } else {
                setFilteredResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setFilteredResults([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleFollow = async (targetUserId, isFollowing, index) => {
        try {
            setLoadingFollow(targetUserId);

            const formData = new FormData();
            formData.append("api_secret_key", "Zagasm2025!Api_Key_Secret");
            formData.append("user_id", user.user_id);
            formData.append("do", isFollowing ? "unfollow" : "follow");
            formData.append("id", targetUserId);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/includes/ajax/users/connect.php`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const result = await response.json();

            if (result.success) {
                const updated = [...filteredResults];
                updated[index].i_am_following = !isFollowing;
                setFilteredResults(updated);
            } else {
                console.error("Follow/unfollow action failed:", result.message);
            }
        } catch (error) {
            console.error("Error toggling follow state:", error);
        } finally {
            setLoadingFollow(null);
        }
    };

    return (
        <div className="py-4">
            <div className="container-fluid p-0">
                <SideBarNav />

                <div className=" offset-xl-2 offset-lg-1 offset-md-1 create-post-row">
                    <main
                        className="col col-xl-8 order-xl-2 col-lg-8 order-lg-1 col-md-12 col-sm-12 col-12 main_container  "
                        style={{ padding: '65px 0px 0px 0px',height:'90vh',background:'whie' }}
                    >
                        {/* <div className="heading text-center mb-4">
                            <h1 style={{ color: '#8000FF' }}>Discover</h1>
                            <p>Find amazing people, discover creators, and connect with new friends!</p>
                        </div> */}

                        <div className=" container h-100vh" >
                            <div className="ig-search-container position-relative  h-100 p-2">
                                <div className="ig-search-box d-flex align-items-center">
                                    <i className="feather-search search-icon me-2" style={{ color: '#8000FF' }}></i>
                                    <input
                                        type="text"
                                        className="ig-search-input"
                                        placeholder="Search for anyone, posts"
                                        value={query}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {query && (
                                    <div className="ig-search-result">
                                        {loading ? (
                                            <div className="text-center py-3">
                                                <Spinner animation="border" variant="primary" style={{ color: '#8000FF' }} />
                                            </div>
                                        ) : filteredResults.length > 0 ? (
                                            filteredResults.map((person, index) => (
                                                <Link
                                                    to={`/${person.user_id}`}
                                                    key={person.user_id}
                                                    className="ig-search-item d-flex justify-content-between align-items-center px-3 py-2 text-decoration-none text-dark"
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={
                                                                person.user_picture
                                                                    ? `https://zagasm.com/content/uploads/${person.user_picture}`
                                                                    : default_profilePicture
                                                            }
                                                            alt={person.user_name}
                                                            className="ig-search-avatar"
                                                        />
                                                        <div className="ms-2">
                                                            <div className="ig-search-name">{truncateText(person.user_name, 12)}</div>
                                                            <div className="ig-search-fullname">
                                                                {truncateText(`${person.user_firstname} ${person.user_lastname}`, 20)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        disabled={loadingFollow === person.user_id}
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            toggleFollow(person.user_id, person.i_am_following, index);
                                                        }}
                                                        style={{
                                                            borderRadius: '20px',
                                                            padding: '4px 16px',
                                                            fontWeight: '500',
                                                            background: person.i_am_following ? '#fff' : '#8000FF',
                                                            color: person.i_am_following ? '#8000FF' : '#fff',
                                                            borderColor: '#8000FF',
                                                            minWidth: '90px',
                                                        }}
                                                    >
                                                        {loadingFollow === person.user_id ? (
                                                            <Spinner animation="border" size="sm" />
                                                        ) : person.i_am_following ? 'Following' : 'Follow'}
                                                    </Button>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="ig-search-no-result">No users found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>

                    <RightBarComponent>
                        <SuggestedFriends />
                    </RightBarComponent>
                </div>
            </div>
        </div>
    );
}

export default ExplorePage;
