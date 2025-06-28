import React, { useState, useEffect, useRef } from 'react';
import friendImage from '../../assets/img/IMG_9488.jpeg';
import SinglePostLoader from '../assets/Loader/SinglePostLoader';
import { Carousel } from 'react-bootstrap'; // Import Carousel from react-bootstrap
import './postcss.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import TimeAgo from '../assets/Timmer/timeAgo';
import Linkify from 'react-linkify';
import { Link, useNavigate } from 'react-router-dom';
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
import ImageGallery from '../assets/ImageGallery';
import globe_icon from '../../assets/post_icon/bx_world.png';
import Message_square from '../../assets/post_icon/Message_square.svg';
import laugh_icon from '../../assets/post_icon/laugh_icon.png';
import post_chart from '../../assets/post_icon/post_chart.svg';
import PostSettingsModal from './PostSettingsModal';

function SinglePostTemplate({ data, hideCommentButton = false }) {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showCommentsModal, setShowCommentsModal] = useState(false); // Add this state
console.log(data);
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
    const [showModal, setShowModal] = useState(false);

    const handlePostSettingModalClick = (e) => {
        e.preventDefault();
        setShowModal(true);
    };
    return (
        <div className="p-3 d-flex align-items-center border-bottom osahan-post-header m-0" style={{ background: '#edf2fe75' }}>
            <div className="dropdown-list-image mr-3" style={{ background: '#edf2fe75' }} >
                <img
                    className="rounded-circle"
                    src={data.post_author_picture || friendImage}
                    alt={data.post_author_name}
                />
                <div className={`status-indicator ${data.post_author_online ? 'bg-success' : 'bg-secondary'}`}></div>
            </div>
            <div className="font-weight-bold">
                <div className="text-truncate">
                    <Link to={data.user_id} className="text-dark">
                        {data.post_author_name}
                    </Link>
                </div>
                <div className="small text-gray-500">
                    {/* {new Date(data.time).toLocaleString()} */}
                    {/* {data.time} */}
                    <img className='mr-2' src={globe_icon} alt="" />
                    <TimeAgo date={data.time} />
                </div>
            </div>
            <span className="ml-auto small">
                <div className="btn-group">
                    <button type="button"
                        onClick={handlePostSettingModalClick}
                        className="btn btn-light btn-sm rounded"
                        style={{ background: 'none', border: 'none' }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i className="feather-more-vertical"></i>
                    </button>

                </div>
                {showModal && (
                    <PostSettingsModal
                        post={data}
                        show={showModal}
                        onHide={() => setShowModal(false)}
                    />
                )}
            </span>
        </div>
    );
}

export function PostContent({ data, currentImageIndex, onImageClick }) {
    const [imageLoadError, setImageLoadError] = useState({});
    const [imageLoading, setImageLoading] = useState(true);
    const [showGallery, setShowGallery] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [detectedLinks, setDetectedLinks] = useState([]);

    const isTextOnlyPost = !data.photos || data.photos.length === 0;

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

    const openGallery = (index) => {
        setSelectedImageIndex(index);
        setShowGallery(true);
    };

    const navigateGallery = (direction) => {
        setSelectedImageIndex((prevIndex) => {
            const newIndex = prevIndex + direction;
            if (newIndex >= 0 && newIndex < data.photos.length) return newIndex;
            return prevIndex;
        });
    };

    const handleImageError = (index) => {
        setImageLoadError(prev => ({ ...prev, [index]: true }));
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    return (
        <div className="border-botto osahan-post-body " style={{ background: '#edf2fe75' }}>
            {/* TEXT CONTENT */}
            {data.text && (
                <div className="post-text-container text-dark" style={{ background: '#edf2fe75' }}>
                    <div
                        className="mb- text"
                        style={isTextOnlyPost ? {
                            background: data.background_color_code,
                            color: data.text_color_code || 'black',
                            padding: '80px 20px',
                            fontWeight: 'bolder',
                            textAlign: 'center',
                            fontSize:'15px'
                        } : { padding: '10px' }}
                    >
                        {data.text}
                        {/* <TextFormatter text={data.text} /> */}
                    </div>
                </div>
            )}

            {/* IMAGE(S) CONTENT */}
            {data.photos?.length > 0 && (
                <div className="mt position-relative" style={{ background: '#edf2fe75' }}>
                    {data.photos.length > 1 && (
                        <div
                            className="image-counter-overlay"
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: '#8000FF',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                zIndex: 5
                            }}
                        >
                            {currentImageIndex + 1}/{data.photos.length}
                        </div>
                    )}

                    {data.photos.length > 1 ? (
                        <Carousel
                            activeIndex={currentImageIndex}
                            onSelect={onImageClick}
                            interval={null}
                            indicators={false} // we manually add them below
                            controls
                            className="zagasm-carousel"
                            wrap={false}
                        >
                            {data.photos.map((photo, index) => (
                                <Carousel.Item key={index}>
                                    <div
                                        className="carousel-image-container"
                                        style={{ cursor: 'pointer' }}
                                    >
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
                                                    alt="Post content"
                                                    onError={() => handleImageError(index)}
                                                    onLoad={handleImageLoad}
                                                />
                                            </>
                                        )}
                                    </div>
                                </Carousel.Item>
                            ))}

                            {/* 👇 Carousel Indicators added here */}

                        </Carousel>

                    ) : (
                        <div onClick={() => openGallery(0)} style={{ cursor: 'pointer' }}>
                            {imageLoadError[0] ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                                    <i className="feather-image text-muted" style={{ fontSize: '48px' }}></i>
                                    <p>Image failed to load</p>
                                </div>
                            ) : (
                                <>
                                    {imageLoading && (
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                                            <div className="spinner-border text-primary" role="status"></div>
                                        </div>
                                    )}
                                    <img
                                        src={'https://zagasm.com/content/uploads/' + data.photos[0].source}
                                        className={`img-fluid w-100 ${imageLoading ? 'd-none' : ''}`}
                                        alt="Post content"
                                        style={{ maxHeight: '500px', objectFit: 'cover', borderRadius: '0px', aspectRatio: '1/1' }}
                                        onError={() => handleImageError(0)}
                                        onLoad={handleImageLoad}
                                    />
                                </>
                            )}
                        </div>
                    )}

                </div>

            )}

            {/* OPEN IMAGE GALLERY MODAL */}
            {showGallery && (
                <ImageGallery
                    images={data.photos}
                    currentIndex={selectedImageIndex}
                    onClose={() => setShowGallery(false)}
                    onNavigate={(step) => setSelectedImageIndex(prev => prev + step)}
                />
            )}
        </div>
    );
}



export function PostFooter({ data, hideCommentButton = false }) {
    const { user } = useAuth();

    const [showModal, setShowModal] = useState(false); // for comments
    const [showGallery, setShowGallery] = useState(false); // ✅ for image viewer
    const [galleryStartIndex, setGalleryStartIndex] = useState(0);

    const handleCommentClick = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    return (
        <footer className="pb-3 pt-0 pr-3 pl-3 osahan-post-footer border-bottom pt-2" style={{ background: '#edf2fe75' }} >
            <div className="p-0 d-flex justify-content-between text-center w-100" >


                <button
                    className="text-secondary border-0 bg-transparent post_icon"
                    aria-label={`Views (${data.views_formatted || 0})`}
                >
                    <img src={post_chart} alt="" />
                    <span className="ms-1">{data.views_formatted}</span>
                </button>

                <ShareButton
                    sharesCount={data.shares_formatted || 0}
                    postUrl={`https://zagasmdemo.netlify.app/posts/${data.post_id}`}
                    postTitle="Check out this amazing content!"
                />

                {!hideCommentButton && (
                    <button className="text-secondary border-0 bg-transparent post_icon" onClick={handleCommentClick}>
                        <img src={Message_square} alt="" />

                        <span className='' style={{ marginLeft: '1px' }}> {data.post_comments?.length || 0}</span>
                    </button>
                )}



                <ReactionButton

                    initialCount={data.reaction_haha_count}
                    emoji="😂"
                    postId={data.post_id}
                    i_react={data.i_react}
                    userId={user.user_id}
                    reactionType="haha"
                />
            </div>

            {/* Comment Modal */}
            {!hideCommentButton && showModal && (
                <PostViewModal
                    post={data}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            )}

            {/* ✅ Image Gallery Modal */}
            {showGallery && data.photos?.length > 0 && (
                <ImageGallery
                    images={data.photos}
                    currentIndex={galleryStartIndex}
                    onClose={() => setShowGallery(false)}
                    onNavigate={(offset) => {
                        const newIndex = galleryStartIndex + offset;
                        if (newIndex >= 0 && newIndex < data.photos.length) {
                            setGalleryStartIndex(newIndex);
                        }
                    }}
                />
            )}
        </footer>
    );
}
export default SinglePostTemplate;