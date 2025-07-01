import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import SinglePostTemplate, { PostFooter } from '../single';
import PostContentLoader from '../../assets/Loader/postContentSection';
import FullScreenPreloader from './FullScreenPreloader';
import CommentContainer from '../comment/commentContainer';
// import './postViewStyle.css';

function PostViewModal({ post, show, onHide }) {
    const [isMobile, setIsMobile] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isTextOnlyPost, setIsTextOnlyPost] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (show && post?.id) {
            const background = {
                pathname: location.pathname,
                search: location.search,
                key: location.key
            };

            navigate(`/posts/${post.post_id}`, {
                state: { background },
                replace: true
            });
        }
    }, [show, post?.id]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);

        if (show && post) {
            setIsTextOnlyPost(!post.photos || post.photos.length === 0);
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
        setIsClosing(true);
        setTimeout(() => {
            onHide();
            setIsClosing(false);
            // navigate(-1);
        }, 300); // Match this duration with your CSS animation duration
    };

    if (!post) return null;

    return (
        <>
            <Helmet>
                <title>{post.user_name}'s Post</title>
                <meta property="og:title" content={`${post.user_name}'s Post`} />
                {post.text && (
                    <meta property="og:description" content={post.text.substring(0, 160)} />
                )}
            </Helmet>

            {isLoading && <FullScreenPreloader />}

            <Modal
                show={show && !isLoading}
                onHide={handleClose}
                size="md"
                centered
                className={`fullscreen-post-modal comment_modal ${isClosing ? 'closing' : ''}`}
                backdropClassName="modal-backdrop"
                dialogClassName="m-0"
                animation={false}
                backdrop="static"
                
            >
                <button
                    className="modal-close-btn"
                    onClick={handleClose}
                    aria-label="Close"
                >
                    <span className='fa fa-angle-left'></span>
                </button>

                <Modal.Header className="modal-header-custom border- p-3">
                    <div className="mx-auto">
                        <h6 className="mb-0">Comments</h6>
                    </div>
                </Modal.Header>

                <Modal.Body >
                    <CommentContainer post={post} comment_data={post.comments} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default PostViewModal;