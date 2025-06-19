import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal,  } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

import './postViewStyle.css';
import SinglePostTemplate, { PostFooter } from '../single';
import PostContentLoader from '../../assets/Loader/postContentSection';
import FullScreenPreloader from './FullScreenPreloader';
import CommentContainer from '../comment/commentContainer';
function PostViewModal({ post, show, onHide }) {
    const [isMobile, setIsMobile] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [isTextOnlyPost, setisTextOnlyPost] = useState(false); // Add loading state
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (show && post?.id) {
            // Create a simple serializable state object
            const background = {
                pathname: location.pathname,
                search: location.search,
                key: location.key
            };

            navigate(`/posts/${post.post_id}`, {
                state: { background },
                replace: true // Prevents double entries in history
            });
        }
    }, [show, post?.id]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);

        if (show && post) {
            setisTextOnlyPost(!post.photos || post.photos.length === 0);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000);

            return () => clearTimeout(timer);
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [show, post]);
    const handleCopyLink = () => {
        const postUrl = `${window.location.origin}/posts/${post.post_id}`;
        navigator.clipboard.writeText(postUrl)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy link: ', err);
            });
    };
    const handleSelect = (selectedIndex) => {
        setCurrentImageIndex(selectedIndex);
    };
    const handleClose = () => {
        navigate(-1);
    };
    if (!post) return null;
    return (
        <>
            <Helmet>
                <title>{post.post_author_name}'s Post</title>
                <meta property="og:title" content={`${post.post_author_name}'s Post`} />
                {post.text && (
                    <meta property="og:description" content={post.text.substring(0, 160)} />
                )}
            </Helmet>

            {isLoading && <FullScreenPreloader />}
           
            <Modal
                show={show && !isLoading}
                onHide={onHide}
                size="xl"
                centered
                className="fullscreen-post-modal p-0 m-0 "
                backdrop="static"
                style={{Height:'100vh', padding:'0px', margin:'0px', width:'100%'}}
            >
                 <span
                // type="span"
                // className="btn-clos"
                onClick={onHide}
                aria-label="Close"
                style={{
                    fontSize: '40px',
                    padding: '1px',
                    marginRight: 'auto',
                    color: 'black',
                    float: 'right', 
                    position: 'absolute',
                    right: '20px',
                    top: '0px',
                    // backgroundColor:"#8000FF",
                    // width: '50px',
                    height: '50px',
                    cursor: 'pointer',  
                    zIndex: 1050, // Ensure it appears above the modal content  
                    // borderRadius: '50%',
                    // boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' // Optional shadow for better visibility 

                }}
            >
                &times;
            </span>
               <div style={{maxHeight:'40vh'}}>
                 <Modal.Header className="border-0 p-2 pt-4 d-flex align-items-center">
                    {/* Close Button (X icon) */}


                    {/* Post Title or Author */}
                    <div className="mx-auto">
                        <h6 className="mb-0">{post.post_author_name}'s Post</h6>
                    </div>

                    {/* Copy Link Button */}
                    {/* <Button
                    type='button'
                        variant="link"
                        className="text-dark ms-auto"
                        onClick={handleCopyLink}
                        style={{ padding: '0.5rem' }}
                    >
                        <FiShare2 size={20} />
                    </Button> */}
                </Modal.Header>

                <Modal.Body className="p-0 d-flex flex-column flex-md-row bg-dang" >
                    {/* Post Content Section */}
                    <div className={`post-content-section ${isMobile ? 'mobile-post' : ''}`}>
                        {isLoading ? (
                            <PostContentLoader />
                        ) : (
                            <SinglePostTemplate
                                key={post.post_id}
                                data={post}
                                hideCommentButton={true}
                            />
                        )}
                    </div>

                    {/* Comments Section */}
                    <CommentContainer post={post}  comment_data={post.post_comments} />
                </Modal.Body>
               </div>
            </Modal>
        </>
    );
}
export default PostViewModal;