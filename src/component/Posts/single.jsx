import React, { useState, useEffect } from 'react';
import friendImage from '../../assets/img/IMG_9488.jpeg';
import SinglePostLoader from '../assets/Loader/SinglePostLoader';
import ImageGallery from '../assets/ImageGallery';
import './postcss.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import TimeAgo from '../assets/Timmer/timeAgo';
import Linkify from 'react-linkify';
import { useNavigate } from 'react-router-dom';
import PostCommentButton from './comment/PostCommentButton';
function SinglePostTemplate({ data }) {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    const handlePostClick = () => {
        navigate(`/posts/${data.post_id}`);
    };
    useEffect(() => {
        if (data) {
            // Simulate loading progress
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

    const handleImageClick = (index) => {
        console.log('Image clicked at index:', index);

        setCurrentImageIndex(index);
        setGalleryOpen(true);
    };

    const handleGalleryClose = () => {
        setGalleryOpen(false);
    };

    const handleGalleryNavigate = (delta) => {
        setCurrentImageIndex(prev => {
            const newIndex = typeof delta === 'number'
                ? prev + delta
                : delta;
            return Math.max(0, Math.min(newIndex, data.photos.length - 1));
        });
    };

    if (loading) {
        return <SinglePostLoader />;
    }

    return (
        <div className="box shadow-s border-0 rounded bg-white mb-3 osahan-post">
            <PostHeader data={data} />
            <PostContent
                data={data}
                onImageClick={handleImageClick}
                onPostClick={handlePostClick}
            />
            <PostFooter data={data} onCommentClick={handlePostClick} />

            {galleryOpen && data.photos && (
                <ImageGallery
                    images={data.photos}
                    currentIndex={currentImageIndex}
                    onClose={handleGalleryClose}
                    onNavigate={handleGalleryNavigate}
                />
            )}
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

function PostContent({ data, onImageClick }) {
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
        <div className="border-bottom osahan-post-body">
            {data.text && (
                <div className="post-text-container">
                    <p className="mb-3 text" style={isTextOnlyPost ? {
                        background: data.background_color_code,
                        color: data.text_color_code || '#000',
                        padding: '80px',
                        fontWeight: 'bolder',
                        textAlign: 'center',
                    } : { margin: '10px' }}>
                        {renderTextWithLinks(data.text)}
                    </p>
                    {console.log("Detected Links:", data.text)}
                    {/* Show link previews */}
                    {detectedLinks.map((link, index) => (
                        <LinkPreview key={index} url={link.startsWith('www') ? `http://${link}` : link} />
                    ))}
                </div>
            )}


            {data.photos && Array.isArray(data.photos) && data.photos.length > 0 && (
                <div className="mt position-relative">
                    {imageLoadError[0] ? (
                        <div className="d-flex justify-content-center align-items-center"
                            style={{ height: '300px', backgroundColor: '#f5f5f5' }}>
                            <div className="text-center">
                                <i className="feather-image text-muted" style={{ fontSize: '48px' }}></i>
                                <p className="mt-2">Image failed to load</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {imageLoading && (
                                <div className="d-flex justify-content-center align-items-center"
                                    style={{ height: '300px', backgroundColor: '#f5f5f5' }}>
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            )}
                            <img
                                src={'https://zagasm.com/content/uploads/' + data.photos[0].source}
                                className={`img-fluid rounded w-100 cursor-pointer ${imageLoading ? 'd-none' : ''}`}
                                alt={data.text ? `Image: ${data.text.substring(0, 30)}...` : 'Post content'}
                                onClick={() => onImageClick(0)}
                                style={{ maxHeight: '500px', objectFit: 'cover', borderRadius: '0px' }}
                                onError={() => handleImageError(0)}
                                onLoad={handleImageLoad}
                            />
                        </>
                    )}

                    {/* Image Counter */}
                    {data.photos.length > 1 && (
                        <div
                            className="position-absolute bottom-0 end-0 bg-dark text-white px-2 py-1 m-2 rounded cursor-pointer"
                            onClick={() => onImageClick(0)}
                        >
                            +{data.photos.length - 1} more
                        </div>
                    )}

                    {/* Thumbnail Strip */}
                    {data.photos.length > 1 && (
                        <div className="d-flex mt-2" style={{ gap: '4px' }}>
                            {data.photos.slice(0, 4).map((photo, index) => (
                                imageLoadError[index] ? (
                                    <div key={index} className="d-flex justify-content-center align-items-center"
                                        style={{
                                            width: `${100 / Math.min(data.photos.length, 4)}%`,
                                            height: '60px',
                                            backgroundColor: '#f5f5f5'
                                        }}>
                                        <i className="feather-image text-muted"></i>
                                    </div>
                                ) : (
                                    <img
                                        key={index}
                                        src={'https://zagasm.com/content/uploads/' + photo.source}
                                        className="rounded cursor-pointer"
                                        style={{
                                            width: `${100 / Math.min(data.photos.length, 4)}%`,
                                            height: '60px',
                                            objectFit: 'cover',
                                            borderRadius: '0px'
                                        }}
                                        onClick={() => onImageClick(index)}
                                        alt={`Image ${index + 1}`}
                                        onError={() => handleImageError(index)}
                                    />
                                )
                            ))}
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

export function PostFooter({ data, onCommentClick }) {
    return (
        <div className="p-3 osahan-post-footer d-flex justify-content-between text-center w-100 row post_icon_containe">
            <a href="#" className="text-secondary col">
                <i className="feather-hear">😍</i> {data.reactions_total_count_formatted || 0}
            </a>
            {onCommentClick && <PostCommentButton postId={data.post_id} />}
            <a href="#" className="text-secondary col">
                <i className="feather-share-2"></i> {data.shares_formatted || 0}
            </a>
            <a href="#" className="text-secondary col">
                <i className="feather-eye"></i> {data.views_formatted || 0}
            </a>
        </div>
    );
}

export default SinglePostTemplate;