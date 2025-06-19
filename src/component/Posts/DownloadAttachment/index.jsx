import React, { useState, useEffect } from 'react';
import { Button, Spinner, Toast, Modal } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import axios from 'axios';
import './AttachmentStyle.css'

const PostDownloadButton = ({ data }) => {
    const hasImages = data.photos?.length > 0;
    const hasText = data.text?.trim().length > 0;
    const [isLoading, setIsLoading] = useState(false);
    const [downloadType, setDownloadType] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(true);

    // Simulate loading for modal content
    useEffect(() => {
        if (showModal) {
            setModalLoading(true);
            const timer = setTimeout(() => {
                setModalLoading(false);
            }, 800); // Simulate loading time
            return () => clearTimeout(timer);
        }
    }, [showModal]);

    const showMessage = (message, isError = false) => {
        setToastMessage(message);
        setShowToast(true);
        if (isError) {
            setError(message);
        }
        setTimeout(() => {
            setShowToast(false);
            if (!isError) setError(null);
        }, 3000);
    };

    const downloadTextAsImage = async (text, textColor, backgroundColor) => {
        if (!text || typeof text !== 'string') {
            throw new Error('Invalid text content provided');
        }

        const div = document.createElement('div');
        div.style.color = textColor;
        div.style.backgroundColor = backgroundColor;
        div.style.padding = '40px';
        div.style.borderRadius = '10px';
        div.style.fontSize = '24px';
        div.style.fontWeight = 'bold';
        div.style.textAlign = 'center';
        div.style.display = 'inline-block';
        div.style.maxWidth = '800px';
        div.style.whiteSpace = 'pre-wrap';
        div.style.wordWrap = 'break-word';
        div.style.overflow = 'hidden';
        div.textContent = text;

        document.body.appendChild(div);
        setProgress(30);

        try {
            const canvas = await html2canvas(div, {
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
                onclone: (clonedDoc) => {
                    setProgress(60);
                },
                onerror: (err) => {
                    throw err;
                }
            });

            if (!canvas || canvas.width === 0 || canvas.height === 0) {
                throw new Error('Canvas rendering failed');
            }

            setProgress(80);

            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    try {
                        if (!blob || blob.size === 0) {
                            throw new Error('Invalid image blob generated');
                        }

                        if (!blob.type.startsWith('image/')) {
                            throw new Error('Generated blob is not an image');
                        }

                        saveAs(blob, 'post-text.png');
                        setProgress(100);
                        resolve();
                        setShowModal(false);
                    } catch (error) {
                        reject(error);
                    } finally {
                        document.body.removeChild(div);
                    }
                }, 'image/png', 0.9);
            });
        } catch (error) {
            document.body.removeChild(div);
            throw error;
        }
    };

    const downloadImages = async (photos) => {
        try {
            const zip = new JSZip();
            const imgFolder = zip.folder("post-images");
            const totalImages = photos.length;
            let processedImages = 0;

            for (let i = 0; i < totalImages; i++) {
                const photo = photos[i];
                try {
                    const response = await axios.get(`/api/download-image`, {
                        params: { url: photo.source },
                        responseType: 'blob',
                        validateStatus: (status) => status === 200,
                        onDownloadProgress: (progressEvent) => {
                            const percent = Math.round(
                                ((processedImages + (progressEvent.loaded / progressEvent.total)) / totalImages * 80
                                ));
                            setProgress(percent);
                        }
                    });

                    if (!(response.data instanceof Blob) || response.data.size === 0) {
                        throw new Error('Invalid image blob received');
                    }

                    const extension = photo.source.split('.').pop()?.split('?')[0] || 'jpg';
                    imgFolder.file(`image-${i + 1}.${extension}`, response.data);
                    processedImages++;
                    setProgress(Math.round((processedImages / totalImages) * 80));
                    setShowModal(false);
                } catch (error) {
                    console.error(`Failed to download image ${i}:`, error);
                    window.open(`https://zagasm.com/content/uploads/${photo.source}`, '_blank');
                }
            }

            setProgress(90);
            const content = await zip.generateAsync(
                { type: 'blob' },
                ({ percent }) => {
                    setProgress(90 + percent / 10);
                }
            );

            if (!content || content.size === 0) {
                throw new Error('Generated ZIP file is invalid');
            }

            setProgress(100);
            saveAs(content, 'post-images.zip');
            return processedImages;
        } catch (error) {
            console.error('Error creating zip:', error);
            throw error;
        }
    };

    const handleDownload = async (type) => {

        setError(null);
        setIsLoading(true);
        setDownloadType(type);
        setProgress(0);

        try {
            if (type === 'text') {
                await downloadTextAsImage(
                    data.text,
                    data.text_color_code || '#000000',
                    data.background_color_code || '#ffffff'
                );
                showMessage('Text image downloaded successfully!');
            } else if (type === 'images') {
                const downloadedCount = await downloadImages(data.photos);
                showMessage(`Downloaded ${downloadedCount}/${data.photos.length} images`);
            }
        } catch (error) {
            console.error('Download failed:', error);
            showMessage(`Download failed: ${error.message}`, true);
        } finally {
            setIsLoading(false);
            setDownloadType(null);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <div className="position-relative">
            {/* Progress Toast */}
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                className="position-fixed bottom-0 end-0 m-3"
                bg={error ? "danger" : "dark"}
                delay={3000}
                autohide
            >
                <Toast.Body className={error ? "text-white" : "text-white"}>
                    {toastMessage}
                </Toast.Body>
            </Toast>

            {/* Download Button */}
            <Button
                variant="link"
                className="text-secondary border-0 bg-transparent p-0"
                onClick={() => setShowModal(true)}
                disabled={isLoading}
            >
                <i className="feather-download"></i>
            </Button>

            {/* Download Options Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" centered>
                <Modal.Header closeButton>
                    {/* <Modal.Title>Download Options</Modal.Title> */}
                </Modal.Header>
                <Modal.Body className="position-relative" style={{ maxHeight: '150px' }}>
                    {modalLoading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                            <Spinner style={{color:'#8000FF'}} animation="border" variant="primary" />
                        </div>
                    ) : (
                        <div className="row g-3 text-center">
                            {hasText && (
                                <div className="col-12 col-md-6">
                                    <Button
                                        className="w-100 custom-download-btn"
                                        onClick={() => handleDownload('text')}
                                        disabled={isLoading}
                                        style={{background: '#8000FF'}}
                                    >
                                        <span>Download Text as Image</span>
                                        {isLoading && downloadType === 'text' && (
                                            <Spinner style={{color:'#8000FF'}} animation="border" size="sm" className="ms-2" />
                                        )}
                                    </Button>
                                </div>
                            )}
                            {hasImages && (
                                <div className="col-12 col-md-6">
                                    <Button
                                        className="w-100 custom-download-btn"
                                        onClick={() => handleDownload('images')}
                                        disabled={isLoading}
                                         style={{background: '#8000FF'}}
                                    >
                                        <span>
                                            {data.photos.length > 1 ? 'Download All Images' : 'Download Image'}
                                        </span>
                                        {isLoading && downloadType === 'images' && (
                                            <>
                                                <Spinner style={{color:'#8000FF'}} animation="border" size="sm" className="ms-2" />
                                                <span className="ms-2 small">{progress}%</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>

            </Modal>

            {/* Progress Bar */}
            {isLoading && (
                <div className="position-fixed bottom-0 start-0 w-100" style={{ zIndex: 9999 }}>
                    <div
                        className={error ? "bg-danger" : "bg-primary"}
                        style={{
                            height: '4px',
                            width: `${progress}%`,
                            transition: 'width 0.3s ease'
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default PostDownloadButton;