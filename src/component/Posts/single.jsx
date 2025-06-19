import React, { useState, useEffect, useRef } from 'react';
import friendImage from '../../assets/img/IMG_9488.jpeg';
import SinglePostLoader from '../assets/Loader/SinglePostLoader';
import { Carousel } from 'react-bootstrap'; // Import Carousel from react-bootstrap
import './postcss.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import TimeAgo from '../assets/Timmer/timeAgo';
import Linkify from 'react-linkify';
import { useNavigate } from 'react-router-dom';
import PostCommentButton from './comment/PostCommentButton';
import TextFormatter from './PostTextFormatter';
import PostViewModal from './PostViewMOdal';
import { useAuth } from '../../pages/auth/AuthContext';
import axios from 'axios';
import { Toast } from 'bootstrap/dist/js/bootstrap.bundle.min';
import { showToast } from '../ToastAlert';
import ShareButton from './sharePostModal';
import { ReactionButton } from './ReactionButton';
import DownloadStyledText from './DownloadAttachment';
import PostDownloadButton from './DownloadAttachment';
function SinglePostTemplate({ data, hideCommentButton = false }) {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showCommentsModal, setShowCommentsModal] = useState(false); // Add this state

    useEffect(() => {
        if (data) {
            const timer = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        setLoading(false);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 100);

            return () => clearInterval(timer);
        }
    }, [data]);

    if (loading) {
        return <SinglePostLoader />;
    }

    return (
        <div className="box shadow-s border-0 rounded bg-white mb-3 osahan-post">
            <PostHeader data={data} />
            <PostContent
                data={data}
                currentImageIndex={currentImageIndex}
                onImageClick={setCurrentImageIndex}
            />
            <PostFooter data={data} totalComment={data.post_comments} hideCommentButton={hideCommentButton} />
        </div>
    );
}
function PostHeader({ data }) {
    return (
        <div className="p-3 d-flex align-items-center border-bottom osahan-post-header">
            <div className="dropdown-list-image mr-3">
                <img
                    className="rounded-circle"
                    src={data.post_author_picture || friendImage}
                    alt={data.post_author_name}
                />
                <div className={`status-indicator ${data.post_author_online ? 'bg-success' : 'bg-secondary'}`}></div>
            </div>
            <div className="font-weight-bold">
                <div className="text-truncate">
                    <a href={data.post_author_url} className="text-dark">
                        {data.post_author_name}
                    </a>
                </div>
                <div className="small text-gray-500">
                    {/* {new Date(data.time).toLocaleString()} */}
                    {/* {data.time} */}
                    <TimeAgo date={data.time} />
                </div>
            </div>
            <span className="ml-auto small">
                <div className="btn-group">
                    <button type="button"
                        className="btn btn-light btn-sm rounded"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i className="feather-more-vertical"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: '200px' }}>
                        <li>
                            <button className="dropdown-item d-flex align-items-center py-2" type="button">
                                <i className="fas fa-bookmark me-3" style={{ width: '20px', color: '#8000FF' }}></i>
                                <span>Save Post</span>
                            </button>
                        </li>
                        <li>
                            <button className="dropdown-item d-flex align-items-center py-2" type="button">
                                <i className="fas fa-link me-3" style={{ width: '20px', color: '#8000FF' }}></i>
                                <span>Copy Link</span>
                            </button>
                        </li>
                        <li>
                            <button className="dropdown-item d-flex align-items-center py-2" type="button">
                                <i className="fas fa-share-alt me-3" style={{ width: '20px', color: '#8000FF' }}></i>
                                <span>Share Post</span>
                            </button>
                        </li>
                        <li>
                            <button className="dropdown-item d-flex align-items-center py-2" type="button">
                                <i className="fas fa-eye-slash me-3" style={{ width: '20px', color: '#8000FF' }}></i>
                                <span>Hide Post</span>
                            </button>
                        </li>
                        <li><hr className="dropdown-divider my-1" /></li>
                        <li>
                            <button className="dropdown-item d-flex align-items-center py-2 text-danger" type="button">
                                <i className="fas fa-flag me-3"></i>
                                <span>Report Post</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </span>
        </div>
    );
}
function PostContent({ data, currentImageIndex, onImageClick }) {
    const [imageLoadError, setImageLoadError] = useState({});
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = (index) => {
        setImageLoadError(prev => ({ ...prev, [index]: true }));
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const isTextOnlyPost = !data.photos || data.photos.length === 0;
    const [detectedLinks, setDetectedLinks] = useState([]);

    useEffect(() => {
        if (data.text) {
            const links = detectLinks(data.text);
            setDetectedLinks(links);
        }
    }, [data.text]);

    const detectLinks = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
        return text.match(urlRegex) || [];
    };

    const renderTextWithLinks = (text) => {
        if (!text) return null;

        return (
            <Linkify
                componentDecorator={(decoratedHref, decoratedText, key) => (
                    <a
                        key={key}
                        href={decoratedHref.startsWith('www') ? `http://${decoratedHref}` : decoratedHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-link"
                    >
                        {decoratedText}
                    </a>
                )}
            >
                {text}
            </Linkify>
        );
    };

    function LinkPreview({ url }) {
        return (
            <div className="link-preview">
                <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                </a>
            </div>
        );
    }

    return (
        <div className="border-botto osahan-post-body">
            {data.text && (
                <div className="post-text-container text-dark">
                    <div className="mb-3 text" style={isTextOnlyPost ? {
                        background: data.background_color_code,
                        color: data.text_color_code || 'black',
                        padding: '80px',
                        fontWeight: 'bolder',
                        textAlign: 'center',
                    } : { margin: '10px' }}>
                        {<TextFormatter text={data.text} />}
                    </div>

                </div>
            )}

            {data.photos && Array.isArray(data.photos) && data.photos.length > 0 && (
                <div className="mt position-relative">
                    {data.photos.length > 1 ? (
                        <Carousel
                            activeIndex={currentImageIndex}
                            onSelect={onImageClick}
                            interval={null}
                            indicators={false}
                            controls={data.photos.length > 1}
                            prevIcon={<span aria-hidden="true" className="custom-prev-icon" />}
                            nextIcon={<span aria-hidden="true" className="custom-next-icon" />}
                            className="zagasm-carousel"
                            wrap={false}
                        >
                            {data.photos.map((photo, index) => (
                                <Carousel.Item key={index}>
                                    <div className="carousel-image-container">
                                        {imageLoadError[index] ? (
                                            <div className="image-error-placeholder">
                                                <i className="feather-image text-muted"></i>
                                                <p>Image failed to load</p>
                                            </div>
                                        ) : (
                                            <>
                                                {imageLoading && (
                                                    <div className="image-loading-placeholder">
                                                        <div className="spinner-border text-primary" role="status"></div>
                                                    </div>
                                                )}
                                                <img
                                                    src={'https://zagasm.com/content/uploads/' + photo.source}
                                                    className={`carousel-image ${imageLoading ? 'd-none' : ''}`}
                                                    alt={data.text ? `Image: ${data.text.substring(0, 30)}...` : 'Post content'}
                                                    onError={() => handleImageError(index)}
                                                    onLoad={handleImageLoad}
                                                />
                                            </>
                                        )}
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>

                    ) : (
                        <>
                            {imageLoadError[0] ? (
                                <div className="d-flex justify-content-center align-items-center"
                                    style={{ height: '400px', backgroundColor: '#f5f5f5' }}>
                                    <div className="text-center">
                                        <i className="feather-image text-muted" style={{ fontSize: '48px' }}></i>
                                        <p className="mt-2">Image failed to load</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {imageLoading && (
                                        <div className="d-flex justify-content-center align-items-center"
                                            style={{ height: '400px', backgroundColor: '#f5f5f5' }}>
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                    <img
                                        src={'https://zagasm.com/content/uploads/' + data.photos[0].source}
                                        className={`img-fluid w-100 ${imageLoading ? 'd-none' : ''}`}
                                        alt={data.text ? `Image: ${data.text.substring(0, 30)}...` : 'Post content'}
                                        style={{
                                            maxHeight: '500px',
                                            objectFit: 'cover',
                                            borderRadius: '0px',
                                            aspectRatio: '1/1'
                                        }}
                                        onError={() => handleImageError(0)}
                                        onLoad={handleImageLoad}
                                    />
                                </>
                            )}
                        </>
                    )}

                    {/* Image counter for carousel */}
                    {data.photos.length > 1 && (
                        <div className="position-absolute top-0 end-0 bg-dark text-white px-2 py-1 m-2 rounded" style={{ opacity: 0.8 }}>
                            {Math.min(Number(currentImageIndex) + 1, data.photos.length)}/{data.photos.length}
                        </div>
                    )}
                    {data.photos.length > 1 && (
                        <div className="d-flex justify-content-center position-absolute bottom-0 start-0 end-0 mb-2">
                            <div className="d-flex" style={{ gap: '6px' }}>
                                {data.photos.map((_, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            backgroundColor: index === currentImageIndex ? '#0095f6' : 'rgba(255,255,255,0.5)',
                                            transition: 'background-color 0.3s ease'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {data.og_image && (!data.photos || data.photos.length === 0) && (
                <div className="mt-2">
                    {imageLoadError['og'] ? (
                        <div className="d-flex justify-content-center align-items-center"
                            style={{ height: '300px', backgroundColor: '#f5f5f5', borderRadius: '0px' }}>
                            <div className="text-center">
                                <i className="feather-image text-muted" style={{ fontSize: '48px' }}></i>
                                <p className="mt-2">Image failed to load</p>
                            </div>
                        </div>
                    ) : (
                        <img
                            src={data.og_image}
                            className="img-fluid rounded"
                            alt="Post content"
                            onError={() => handleImageError('og')}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
export function PostFooter({ data, hideCommentButton = false }) {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const handleCommentClick = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    return (
        <footer className="p-3 osahan-post-footer border-bottom">
            <div className="d-flex justify-content-between text-center w-100">
                {/* Replace the download button with our new component */}
               <PostDownloadButton data={data} />
                
                <ShareButton
                    sharesCount={data.shares_formatted || 0}
                    postUrl={`https://zagasmdemo.netlify.app/posts/${data.post_id}`}
                    postTitle="Check out this amazing content!"
                />
                
                {!hideCommentButton && (
                    <button className="text-secondary border-0 bg-transparent" onClick={handleCommentClick}>
                        <span className="feather-message-square"></span> {data.post_comments && data.post_comments.length || 0}
                    </button>
                )}
                
                <button
                    className="text-secondary border-0 bg-transparent"
                    aria-label={`Views (${data.views_formatted || 0})`}
                >
                    <span className="feather-icon feather-eye" aria-hidden="true"></span>
                    <span className="ms-1">{data.views_formatted || 0}</span>
                </button>
                
                <ReactionButton
                    initialCount={data.reaction_haha_count}
                    emoji="😂"
                    postId={data.post_id}
                    userId={user.user_id}
                    reactionType="haha"
                />
            </div>

            {!hideCommentButton && showModal && (
                <PostViewModal
                    post={data}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            )}
        </footer>
    );
}
export default SinglePostTemplate;