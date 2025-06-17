import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';  // Changed from react-helmet
import PostViewModal from '../../../component/Posts/PostViewMOdal';
import { usePost } from '../../../component/Posts/PostContext';
function PostDetailsPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { fetchPostById, currentPost, singlePostLoading } = usePost();
    useEffect(() => {
        if (postId) {
            fetchPostById(postId);
        }
    }, [postId]);




    if (singlePostLoading) {
        return <div>Loading post...</div>;
    }

    if (!currentPost) {
        return <div>Post not found</div>;
    }

    return (
        <>
        {console.log("Current Post:", currentPost)}
            <Helmet>
                <title>{currentPost.post_author_name}'s Post</title>
                <meta property="og:title" content={`${currentPost.post_author_name}'s Post`} />
                <meta property="og:description" content={currentPost.text ? currentPost.text.substring(0, 160) : ''} />
                {currentPost.photos && currentPost.photos.length > 0 && (
                    <meta property="og:image" content={`https://zagasm.com/content/uploads/${currentPost.photos[0].source}`} />
                )}
            </Helmet>

            <PostViewModal
                post={currentPost}
                show={true}
                onHide={() => navigate(-2)}
            />
        </>
    );
}

export default PostDetailsPage;