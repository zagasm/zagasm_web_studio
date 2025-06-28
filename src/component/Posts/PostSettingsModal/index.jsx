import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import SinglePostTemplate, { PostFooter } from '../single';
import PostContentLoader from '../../assets/Loader/postContentSection';
import FullScreenPreloader from './FullScreenPreloader';
import CommentContainer from '../comment/commentContainer';
import PostDownloadButton from '../DownloadAttachment';
import '../ReadPost/postViewStyle.css';
import { useAuth } from '../../../pages/auth/AuthContext';
function PostSettingsModal({ post, show, onHide }) {
    const [isMobile, setIsMobile] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isTextOnlyPost, setIsTextOnlyPost] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const {user} = useAuth();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        if (show && post) {

            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
        return () => window.removeEventListener('resize', handleResize);
    }, [show, post]);



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
                className={`fullscreen-post-modal ${isClosing ? 'closing' : ''}`}
                backdropClassName="modal-backdrop"
                dialogClassName="m-0 p-0"
                animation={false}
                backdrop="static"
            >
                <button
                    className="modal-close-btn ml-3"
                    onClick={handleClose}
                    aria-label="Close"
                >
                    <span className='fa fa-angle-left'></span>
                </button>
                <Modal.Body style={{ padding: '0px', margin: '0px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <div className='w-100 ' style={{ padding: '70px 10px 0px 10px' }}>
                           { user.user_id != post.user_id && <div className="d-flex align-items-center p-3 " >
                                <div className="mr-3" style={{ position: 'relative' }}>
                                    <img
                                        className="rounded-circle"
                                        src={post.post_author_picture || friendImage}
                                        alt="Friend"
                                        style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                                    />
                                  
                                </div>
                                <div className="font-weight-bold" style={{ flex: '1' }}>
                                    <div className='text-truncate'>{post.post_author_name}</div>
                                </div>
                                <button type="button" style={{ background: '#EEDAFB' }} className="btn btn-sm">
                                    <span>Follow</span> <i className="feather-user-plus ml-2"></i>
                                </button>
                            </div>}

                            <ul className="list-unstyled">
                                <li >
                                    <PostDownloadButton data={post} />
                                </li>
                                <li>
                                    <button
                                        className="w-100 text-left d-flex align-items-center py-3 px-4"
                                        type="button"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <i className="far fa-bookmark mr-3" style={{ width: '24px', fontSize: '20px' }}></i>
                                        <span>Save Post</span>
                                    </button>
                                </li>
                                <li >
                                    <button
                                        className="w-100 text-left d-flex align-items-center py-3 px-4"
                                        type="button"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <i className="fas fa-link mr-3" style={{ width: '24px', fontSize: '20px' }}></i>
                                        <span>Copy Link</span>
                                    </button>
                                </li>
                                <li >
                                    <button
                                        className="w-100 text-left d-flex align-items-center py-3 px-4"
                                        type="button"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <i className="far fa-eye-slash mr-3" style={{ width: '24px', fontSize: '20px' }}></i>
                                        <span>Hide</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-100 text-left d-flex align-items-center py-3 px-4"
                                        type="button"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '14px',
                                            color: '#ed4956'
                                        }}
                                    >
                                        <i className="far fa-flag mr-3" style={{ width: '24px', fontSize: '20px' }}></i>
                                        <span>Report</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default PostSettingsModal;