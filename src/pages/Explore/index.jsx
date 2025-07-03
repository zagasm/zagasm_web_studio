import React, { useState, useEffect } from 'react';
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
import ShimmerExploreLoader from './ShimmerExploreLoader/index.jsx';

const RECENT_KEY = 'zagasm_recent_searches';

const truncateText = (text, maxLength) =>
  text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;

function groupByDate(items) {
  const groups = {};
  items.forEach(item => {
    const date = new Date(item.timestamp);
    const today = new Date();
    const label =
      date.toDateString() === today.toDateString()
        ? 'Today'
        : new Date(today.setDate(today.getDate() - 1)).toDateString() ===
          date.toDateString()
        ? 'Yesterday'
        : date.toLocaleDateString();
    groups[label] = groups[label] || [];
    groups[label].push(item);
  });
  return groups;
}

function ExplorePage() {
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const { user } = useAuth();

  // Load recent from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
    setRecentSearches(stored);
  }, []);

  const saveToRecentSearches = person => {
    const minimal = {
      user_id: person.user_id,
      user_name: person.user_name,
      user_firstname: person.user_firstname,
      user_lastname: person.user_lastname,
      user_picture: person.user_picture,
      timestamp: Date.now(),
    };
    const updated = [minimal, ...recentSearches.filter(r => r.user_id !== minimal.user_id)];
    if (updated.length > 10) updated.splice(10);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const removeFromRecent = id => {
    const updated = recentSearches.filter(r => r.user_id !== id);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_KEY);
  };

  const handleInputChange = async e => {
    const v = e.target.value;
    setQuery(v);
    if (v.trim() === '') {
      setFilteredResults([]);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('api_secret_key', 'Zagasm2025!Api_Key_Secret');
      formData.append('user_id', user.user_id);
      formData.append('query', v);
      const resp = await axios.post(
        'https://zagasm.com/includes/ajax/users/search.php',
        formData,
        { withCredentials: true }
      );
      setFilteredResults(resp.data.success ? resp.data.results : []);
    } catch (err) {
      console.error(err);
      setFilteredResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (uid, isFollowing, idx) => {
    setLoadingFollow(uid);
    try {
      const formData = new FormData();
      formData.append("api_secret_key", "Zagasm2025!Api_Key_Secret");
      formData.append("user_id", user.user_id);
      formData.append("do", isFollowing ? "unfollow" : "follow");
      formData.append("id", uid);
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/includes/ajax/users/connect.php`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const json = await resp.json();
      if (json.success) {
        const copy = [...filteredResults];
        copy[idx].i_am_following = !isFollowing;
        setFilteredResults(copy);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFollow(null);
    }
  };

  const grouped = groupByDate(recentSearches);

  return (
    <div className="py-4">
      <div className="container-fluid p-0">
        <SideBarNav />
        <div className="offset-xl-2 offset-lg-1 offset-md-1 create-post-row">
          <main className="col col-xl-8 col-lg-8 col-md-12 main_container explore-main-section">
            <div className="explore-header text-center mb-4">
              <h2 className="explore-title">Discover People</h2>
              {/* <p className="explore-subtitle">
                Find creators, friends and communities
              </p> */}
            </div>

            <div className="container">
              <div className="ig-search-container position-relative p-2">
                <div className="ig-search-box d-flex align-items-center">
                  <i className="feather-search search-icon me-2"></i>
                  <input
                    type="text"
                    className="ig-search-input"
                    placeholder="Search for anyone, posts"
                    value={query}
                    onChange={handleInputChange}
                  />
                </div>

                {query ? (
                  <div className="ig-search-result mt-3">
                    {loading ? (
                       <ShimmerExploreLoader />
                    ) : filteredResults.length > 0 ? (
                      filteredResults.map((p, i) => (
                        <Link
                          to={`/${p.user_id}`}
                          key={p.user_id}
                          className="ig-search-item d-flex justify-content-between align-items-center px-3 py-2 text-decoration-none text-dark"
                          onClick={() => saveToRecentSearches(p)}
                        >
                          <div className="d-flex align-items-center">
                            <img
                              src={
                                p.user_picture
                                  ? `https://zagasm.com/content/uploads/${p.user_picture}`
                                  : default_profilePicture
                              }
                              alt={p.user_name}
                              className="ig-search-avatar"
                            />
                            <div className="ms-2">
                              <div className="ig-search-name">
                                {truncateText(p.user_name, 12)}
                              </div>
                              <div className="ig-search-fullname">
                                {truncateText(
                                  `${p.user_firstname} ${p.user_lastname}`,
                                  20
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            disabled={loadingFollow === p.user_id}
                            size="sm"
                            onClick={e => {
                              e.preventDefault();
                              toggleFollow(p.user_id, p.i_am_following, i);
                            }}
                            style={{
                              borderRadius: '20px',
                              padding: '4px 16px',
                              fontWeight: '500',
                              background: p.i_am_following ? '#fff' : '#8000FF',
                              color: p.i_am_following ? '#8000FF' : '#fff',
                              borderColor: '#8000FF',
                              minWidth: '90px',
                            }}
                          >
                            {loadingFollow === p.user_id ? (
                              <Spinner animation="border" size="sm" />
                            ) : p.i_am_following ? (
                              'Following'
                            ) : (
                              'Follow'
                            )}
                          </Button>
                        </Link>
                      ))
                    ) : (
                      <div className="ig-search-no-result">No users found</div>
                    )}
                  </div>
                ) : recentSearches.length > 0 ? (
                  <div className="ig-search-result mt-3">
                    <div className="d-flex justify-content-between px-3 py-2 text-muted">
                      <small>Recent Searches</small>
                      <button
                        className="btn btn-link p-0 text-danger"
                        onClick={clearAllRecent}
                      >
                        Clear All
                      </button>
                    </div>

                    {Object.entries(grouped).map(([day, arr]) => (
                      <div key={day}>
                        <div className="px-3 py-1 text-secondary">{day}</div>
                        {arr.map(p => (
                          <div
                            key={p.user_id + p.timestamp}
                            className="ig-search-item d-flex justify-content-between align-items-center px-3 py-2"
                          >
                            <Link
                              to={`/${p.user_id}`}
                              className="d-flex align-items-center text-decoration-none text-dark"
                            >
                              <img
                                src={
                                  p.user_picture
                                    ? `https://zagasm.com/content/uploads/${p.user_picture}`
                                    : default_profilePicture
                                }
                                alt={p.user_name}
                                className="ig-search-avatar"
                              />
                              <div className="ms-2">
                                <div className="ig-search-name">
                                  {truncateText(p.user_name, 12)}
                                </div>
                                <div className="ig-search-fullname">
                                  {truncateText(
                                    `${p.user_firstname} ${p.user_lastname}`,
                                    20
                                  )}
                                </div>
                              </div>
                            </Link>
                            <button
                              className="btn btn-sm text-danger"
                              onClick={() => removeFromRecent(p.user_id)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : null}
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
