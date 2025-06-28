import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './ImageGallery.css';

const ImageGallery = ({ images, currentIndex, onClose, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const [thumbStatus, setThumbStatus] = useState(
    images.map(() => ({ loading: true, error: false }))
  );

  const [currentImage, setCurrentImage] = useState(images[currentIndex]);

  useEffect(() => {
    setCurrentImage(images[currentIndex]);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setLoading(true);
    setError(false);
  }, [currentIndex, images]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(-1);
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNavigate(1);
      if (e.key === '+') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === '0') handleResetZoom();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, onClose, onNavigate]);

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleMouseMove = (e) => {
    if (!isDragging && scale > 1) {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
    setShowControls(true);
    resetControlsTimeout();
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();
    const maxX = (imageRect.width * scale - containerRect.width) / 2;
    const maxY = (imageRect.height * scale - containerRect.height) / 2;
    let newX = e.clientX - startPos.x;
    let newY = e.clientY - startPos.y;
    newX = Math.min(Math.max(newX, -maxX), maxX);
    newY = Math.min(Math.max(newY, -maxY), maxY);
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `https://zagasm.com/content/uploads/${currentImage.source}`;
    link.download = `image-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return createPortal(
    <div className="image-gallery-overlay" onMouseMove={handleMouseMove}>
      {/* Close Button */}
      <button
        className={`close-btn ${showControls ? 'visible' : 'hidden'}`}
        onClick={onClose}
        aria-label="Close gallery"
      >
        ✕
      </button>

      {/* Controls */}
      <div className={`gallery-controls ${showControls ? 'visible' : 'hidden'}`}>
        <div className="zoom-controls">
          <button onClick={handleZoomIn}><i className="feather-plus"></i></button>
          <button onClick={handleZoomOut}><i className="feather-minus"></i></button>
          <button onClick={handleResetZoom}><i className="feather-refresh-ccw"></i></button>
        </div>
        <div className="info-controls">
          <span className="image-counter">
            {currentIndex + 1} / {images.length}
          </span>
          <button onClick={handleDownload}>
            <i className="feather-download"></i>
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div
        className="gallery-content"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleDragMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="main-image-container">
          {loading && <div className="image-loading"><div className="spinner"></div></div>}
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
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
            }}
            onLoad={() => {
              setLoading(false);
              setError(false);
              resetControlsTimeout();
            }}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            onClick={() => scale === 1 && handleZoomIn()}
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className={`nav-btn left-btn ${currentIndex === 0 ? 'disabled' : ''}`}
              onClick={() => currentIndex > 0 && onNavigate(-1)}
            >
              ‹
            </button>
            <button
              className={`nav-btn right-btn ${currentIndex === images.length - 1 ? 'disabled' : ''}`}
              onClick={() => currentIndex < images.length - 1 && onNavigate(1)}
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={`thumbnail-container ${showControls ? 'visible' : 'hidden'}`}>
          {images.map((img, index) => {
            const status = thumbStatus[index];
            return (
              <div key={index} className="thumbnail-wrapper">
                {status.loading && <div className="thumb-loading"></div>}
                {status.error ? (
                  <div className="thumb-error"><i className="feather-image"></i></div>
                ) : (
                  <img
                    src={`https://zagasm.com/content/uploads/${img.source}`}
                    className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => onNavigate(index - currentIndex)}
                    alt={`Thumbnail ${index + 1}`}
                    onLoad={() => {
                      setThumbStatus((prev) => {
                        const updated = [...prev];
                        updated[index] = { loading: false, error: false };
                        return updated;
                      });
                    }}
                    onError={() => {
                      setThumbStatus((prev) => {
                        const updated = [...prev];
                        updated[index] = { loading: false, error: true };
                        return updated;
                      });
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
