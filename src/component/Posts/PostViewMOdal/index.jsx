import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Image, Spinner, Carousel } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { BsEmojiSmile, BsThreeDots } from 'react-icons/bs';
import { FiSend, FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi';
import { FaRegBookmark, FaHeart } from 'react-icons/fa';
import './postViewStyle.css';
import Linkify from 'react-linkify';
import PostTextFormatter from '../PostTextFormatter';
import { PostFooter } from '../single';
import PostContentLoader from '../../assets/Loader/postContentSection';
import FullScreenPreloader from './FullScreenPreloader';
import CommentContainer from '../comment/commentContainer';
import TimeAgo from '../../assets/Timmer/timeAgo';
function PostViewModal({ post, show, onHide }) {
    const [isMobile, setIsMobile] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post?.reactions_total_count || 0);
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
                onHide={handleClose}
                size="xl"
                centered
                fullscreen={true} // Force fullscreen always
                className="fullscreen-post-modal"
                backdrop="static"
            >
                <Modal.Header closeButton className="border-0 p-2">
                    <Modal.Title className="visually-hidden">Post Details</Modal.Title>
                    {/* Add copy link button to header */}
                    {/* <Button
                        variant="link"
                        className="text-dark ms-auto"
                        onClick={handleCopyLink}
                    >
                        <FiShare2 size={20} /> Copy Link
                    </Button> */}
                    <div className="post-header p-3 d-flex align-items-center border-bottom w-100">
                        <Image
                            src={post.post_author_picture || 'https://via.placeholder.com/40'}
                            roundedCircle
                            width={40}
                            height={40}
                            className="me-3"
                        />
                        <div className="flex-grow-1">
                            <h6 className="mb-0 fw-bold">{post.post_author_name}</h6>
                            <small className="text-muted">
                                <TimeAgo date={post.time} />
                            </small>
                        </div>
                        {/* <Button variant="link" className="text-dark p-0">
                            <BsThreeDots size={20} />
                        </Button> */}
                    </div>
                </Modal.Header>
                <Modal.Body className="p-0 d-flex flex-column flex-md-row">
                    {/* Post Content Section */}
                    <div className={`post-content-section ${isMobile ? 'mobile-post' : ''}`}>
                        {isLoading ? (
                            <PostContentLoader />
                        ) : (
                            <>


                                <div className="post_content_container">
                                    <div className="post-body ">
                                        <div className='p-2'>
                                            {post.text && (
                                                <PostTextFormatter
                                                    className=' mx-auto' style={{ maxWidth: '800px', height: '100%' }}
                                                    text={post.text}
                                                    isTextOnlyPost={isTextOnlyPost}
                                                    background_color_code={post.background_color_code}
                                                    text_color_code={post.text_color_code}
                                                />
                                            )}
                                        </div>

                                        {post.photos && post.photos.length > 0 && (
                                            <div className="post-image-container">
                                                <Carousel
                                                    activeIndex={currentImageIndex}
                                                    onSelect={handleSelect}
                                                    indicators={post.photos.length > 1}
                                                    controls={post.photos.length > 1}
                                                    interval={null}
                                                    touch={true}
                                                    className="post-carousel"
                                                >
                                                    {post.photos.map((photo, index) => (
                                                        <Carousel.Item key={index}>
                                                            <div className="d-flex justify-content-center align-items-center"
                                                                style={{ backgroundColor: 'rgba(24, 24, 24, 0.5)', minHeight: '300px' }}>
                                                                <img
                                                                    src={`https://zagasm.com/content/uploads/${photo.source}`}
                                                                    className="d-block img-fluid"
                                                                    style={{
                                                                        maxHeight: '70vh',
                                                                        objectFit: 'contain',
                                                                        width: 'auto',
                                                                        margin: '0 auto'
                                                                    }}
                                                                    alt={`Post content ${index + 1}`}
                                                                />
                                                            </div>
                                                        </Carousel.Item>
                                                    ))}
                                                </Carousel>

                                                {post.photos.length > 1 && (
                                                    <div className="position-absolute top-0 end-0 m-2 bg-dark text-white px-2 py-1 rounded">
                                                        {`${currentImageIndex + 1}/${post.photos.length}`}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="post-footer px-3 m-auto pb-2 border-top" style={{ maxWidth: '800px', height: '100%' }}>
                                        <PostFooter data={post} />
                                        <hr />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Comments Section */}
                    <CommentContainer post={post} show={show} />
                </Modal.Body>
            </Modal>
        </>
    );
}
export default PostViewModal;