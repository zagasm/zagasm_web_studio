import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './ImageGallery.css';

const ImageGallery = ({ images, currentIndex, onClose, onNavigate }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentImage, setCurrentImage] = useState(images[currentIndex]);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        setError(false);
        setCurrentImage(images[currentIndex]);
        setScale(1); // Reset zoom when changing images
        setPosition({ x: 0, y: 0 }); // Reset position when changing images
    }, [currentIndex, images]);

    const handleImageLoad = () => {
        setLoading(false);
        setError(false);
    };

    const handleImageError = () => {
        setLoading(false);
        setError(true);
    };

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.5, 1));
    };

    const handleResetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        if (scale > 1) {
            setIsDragging(true);
            setStartPos({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();
        
        const maxX = (imageRect.width - containerRect.width) / 2;
        const maxY = (imageRect.height - containerRect.height) / 2;
        
        let newX = e.clientX - startPos.x;
        let newY = e.clientY - startPos.y;
        
        // Constrain movement within image bounds
        newX = Math.min(Math.max(newX, -maxX), maxX);
        newY = Math.min(Math.max(newY, -maxY), maxY);
        
        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return createPortal(
        <div className="image-gallery-overlay">
            <button
                className="close-btn"
                onClick={onClose}
                aria-label="Close gallery"
            >
                ✕
            </button>

            <div className="zoom-controls">
                <button onClick={handleZoomIn} aria-label="Zoom in">
                    <i className="feather-plus"></i>
                </button>
                <button onClick={handleZoomOut} aria-label="Zoom out">
                    <i className="feather-minus"></i>
                </button>
                <button onClick={handleResetZoom} aria-label="Reset zoom">
                    <i className="feather-refresh-ccw"></i>
                </button>
            </div>

            <div 
                className="gallery-content"
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div className="main-image-container">
                    {loading && (
                        <div className="image-loading">
                            <div className="spinner"></div>
                        </div>
                    )}
                    {error && (
                        <div className="image-error">
                            <i className="feather-image"></i>
                            <p>Image failed to load</p>
                        </div>
                    )}
                    <img
                        ref={imageRef}
                        src={`https://zagasm.com/content/uploads/${currentImage.source}`}
                        alt={`Gallery image ${currentIndex + 1}`}
                        className={`gallery-image ${loading || error ? 'hidden' : ''}`}
                        style={{
                            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                        }}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                </div>

                {images.length > 1 && (
                    <>
                        <button
                            className={`nav-btn left-btn ${currentIndex === 0 ? 'disabled' : ''}`}
                            onClick={() => currentIndex > 0 && onNavigate(-1)}
                            aria-label="Previous image"
                        >
                            ‹
                        </button>

                        <button
                            className={`nav-btn right-btn ${currentIndex === images.length - 1 ? 'disabled' : ''}`}
                            onClick={() => currentIndex < images.length - 1 && onNavigate(1)}
                            aria-label="Next image"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {images.length > 1 && (
                <div className="thumbnail-container">
                    {images.map((img, index) => {
                        const [thumbLoading, setThumbLoading] = useState(true);
                        const [thumbError, setThumbError] = useState(false);

                        return (
                            <div key={index} className="thumbnail-wrapper">
                                {thumbLoading && (
                                    <div className="thumb-loading"></div>
                                )}
                                {thumbError ? (
                                    <div className="thumb-error">
                                        <i className="feather-image"></i>
                                    </div>
                                ) : (
                                    <img
                                        src={`https://zagasm.com/content/uploads/${img.source}`}
                                        className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                                        onClick={() => {
                                            onNavigate(index - currentIndex);
                                            handleResetZoom();
                                        }}
                                        alt={`Thumbnail ${index + 1}`}
                                        onLoad={() => setThumbLoading(false)}
                                        onError={() => {
                                            setThumbLoading(false);
                                            setThumbError(true);
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>,
        document.body
    );
};

export default ImageGallery;