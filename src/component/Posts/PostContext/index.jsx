import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import LoadingOverlay from "../../assets/projectOverlay.jsx";
import { showToast } from "../../ToastAlert/index.jsx";

const PostContext = createContext();

export const PostProvider = ({ children, user }) => {
    const [HomePostData, setHomePostData] = useState([]);
    const [UserProfilePostData, setUserProfilePostData] = useState([]);
    const [SidepostData, setSidepostData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [singlePostLoading, setSinglePostLoading] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    const user_id = user?.user_id;

    useEffect(() => {
        if (user_id) {
            fetchUserPost();
            fetchPost();
        } else {
            setLoading(false);
            setMessage({
                type: 'info',
                message: 'Please sign in to view posts'
            });
        }
    }, [user_id]);

    const fetchPostById = async (postId) => {
        if (!user_id) {
            setMessage({
                type: 'error',
                message: 'User not authenticated'
            });
            return null;
        }

        setSinglePostLoading(true);
        setMessage("");

        try {
            const formPayload = new FormData();
            formPayload.append("api_secret_key", import.meta.env.VITE_API_SECRET || 'Zagasm2025!Api_Key_Secret');
            formPayload.append("post_id", postId);
            formPayload.append("user_id", user_id);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/includes/ajax/posts/get_post_details.php`,
                {
                    method: "POST",
                    body: formPayload,
                    // credentials: 'include'
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            console.log("single Post data:", responseData.post);
            if (!responseData.post) {
                throw new Error("Post not found");
            }

            setCurrentPost(responseData.post);
            return responseData.post;

        } catch (error) {
            console.log("Error fetching post:", error);
            setMessage({
                type: "danger",
                message: error.message || "Failed to load post"
            });
            showToast.error(error.message || "Failed to load post");
            return null;
        } finally {
            setSinglePostLoading(false);
        }
    };

  

    const fetchPost = async () => {
        if (!user_id) {
            setMessage({
                type: 'error',
                message: 'User not authenticated'
            });
            return;
        }

        setMessage("");
        setLoading(true);

        try {
            const formPayload = new FormData();
            formPayload.append("api_secret_key", import.meta.env.VITE_API_SECRET || 'Zagasm2025!Api_Key_Secret');
            // formPayload.append("offset", '30');
            formPayload.append("limit", '30');
            formPayload.append("user_id", user_id);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/includes/ajax/posts/get_newsfeed.php`,
                {
                    method: "POST",
                    body: formPayload,
                    // credentials: 'include'
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            setHomePostData(responseData.posts);

        } catch (error) {
            console.log("Error fetching posts:", error);
            setHomePostData([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPost = async (profileId) => {
        if (!user_id) {
            setMessage({
                type: 'error',
                message: 'User not authenticated'
            });
            return;
        }
        setMessage("");
        setLoading(true);

        try {
            const formPayload = new FormData();
            formPayload.append("api_secret_key", import.meta.env.VITE_API_SECRET || 'Zagasm2025!Api_Key_Secret');
            formPayload.append("profile_id", profileId);
            // formPayload.append("offset", '1');
            formPayload.append("limit", '100');
            formPayload.append("user_id", user_id);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/includes/ajax/users/get_user_posts.php`,
                {
                    method: "POST",
                    body: formPayload,
                    // credentials: 'include'
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
             if (!responseData.posts) {
                throw new Error("Post not found");
            }
            setUserProfilePostData(responseData.posts);
            return responseData.posts;

        } catch (error) {
            console.log("Error fetching posts:", error);
            setUserProfilePostData([]);
        } finally {
            setLoading(false);
        }
    };

    const getRandomEvents = (posts, count) => {
        if (!posts || posts.length === 0) return [];
        const shuffled = [...posts].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    };

    return (
        <PostContext.Provider
            value={{
                HomePostData,
                loading,
                UserProfilePostData,
                message,
                currentPost,
                singlePostLoading,
                
                fetchPost,
                fetchPostById,
                refreshProfilePost: fetchUserPost,
                refreshPosts: fetchPost
            }}
        >
            {loading && <LoadingOverlay />}
            {children}
        </PostContext.Provider>
    );
};

export const usePost = () => useContext(PostContext);

PostProvider.propTypes = {
    user: PropTypes.shape({
        user_id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    }),
    children: PropTypes.node.isRequired
};

PostProvider.defaultProps = {
    user: null
};