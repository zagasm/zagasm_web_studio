import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types'; // Add this import
import LoadingOverlay from "../../assets/projectOverlay.jsx";
import { showToast } from "../../ToastAlert/index.jsx";

const PostContext = createContext();

export const PostProvider = ({ children, user }) => {
    const [HomePostData, setHomePostData] = useState([]);
    const [UserProfilePostData, setUserProfilePostData] = useState([]);
    const [SidepostData, setSidepostData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    
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
            // formPayload.append("get", 'newsfeed');
            
            formPayload.append("offset", '2');
            formPayload.append("user_id", user_id);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/includes/ajax/posts/get_newsfeed.php`,
                {
                    method: "POST",
                    body: formPayload,
                    credentials: 'include'
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            //  console.log("Response Data:", responseData);
            // if (!responseData.success ) {
            //     throw new Error(responseData.message || responseData.api_message || "Request failed");
            // }
            // console.log("Response Data:", responseData.data);
              
            setHomePostData(responseData.posts);
            // setSidepostData(
            //     responseData.postdata ? getRandomEvents(responseData.postdata, 5) : []
            // );
            
            // setMessage({
            //     type: "success",
            //     message: responseData.api_message || "Posts loaded successfully"
            // });

        } catch (error) {
            console.log("Error fetching posts:", error);
              setHomePostData([]);
            // setMessage({
            //     type: "danger",
            //     message: error.message || "Failed to load posts"
            // });
            // showToast.error(error.message || "Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

     const fetchUserPost = async () => {
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
            formPayload.append("profile_id", user_id);
            formPayload.append("offset", '1');
            formPayload.append("user_id", user_id);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/includes/ajax/users/get_user_posts.php`,
                {
                    method: "POST",
                    body: formPayload,
                    credentials: 'include'
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
             console.log("Response Data:", responseData);
            // if (!responseData.success ) {
            //     throw new Error(responseData.message || responseData.api_message || "Request failed");
            // }
            // console.log("Response Data:", responseData.data);
              
            setUserProfilePostData(responseData.posts);
            // setSidepostData(
            //     responseData.postdata ? getRandomEvents(responseData.postdata, 5) : []
            // );
            
            // setMessage({
            //     type: "success",
            //     message: responseData.api_message || "Posts loaded successfully"
            // });

        } catch (error) {
            console.log("Error fetching posts:", error);
              setUserProfilePostData([]);
            // setMessage({
            //     type: "danger",
            //     message: error.message || "Failed to load posts"
            // });
            // showToast.error(error.message || "Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    const getRandomEvents = (posts, count) => {
        if (!posts || posts.length === 0) return [];
        const shuffled = [...posts].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    };
console.log('checking',UserProfilePostData);
    return (
        <PostContext.Provider
            value={{
                HomePostData,
                loading,
                UserProfilePostData,
                message,
                fetchPost,
                refreshPosts: fetchPost
            }}
        >
            {loading && <LoadingOverlay />}
            {children}
        </PostContext.Provider>
    );
};

export const usePost = () => useContext(PostContext);

// PropTypes validation
PostProvider.propTypes = {
    user: PropTypes.shape({
        user_id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    }),
    children: PropTypes.node.isRequired
};

// Default props
PostProvider.defaultProps = {
    user: null
};