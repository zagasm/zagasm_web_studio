import React, { useState } from 'react';
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import './PostDownloadButton.css';

const BASE_URL = 'https://zagasm.com/content/uploads/';

const PostDownloadButton = ({ data }) => {
    const [showGallery, setShowGallery] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    const hasImages = data.photos?.length > 0;
    const hasText = data.text?.trim().length > 0;

    const toggleSelectImage = (imgSource) => {
        const fullUrl = BASE_URL + imgSource;
        setSelectedImages((prev) =>
            prev.includes(fullUrl)
                ? prev.filter((url) => url !== fullUrl)
                : [...prev, fullUrl]
        );
    };

    const downloadTextAsImage = async () => {
        const div = document.createElement('div');
        div.style.color = data.text_color_code || '#000000';
        div.style.backgroundColor = data.background_color_code || '#ffffff';
        div.style.padding = '40px';
        div.style.borderRadius = '10px';
        div.style.fontSize = '24px';
        div.style.fontWeight = 'bold';
        div.style.textAlign = 'center';
        div.style.display = 'inline-block';
        div.style.maxWidth = '800px';
        div.style.whiteSpace = 'pre-wrap';
        div.style.wordWrap = 'break-word';
        div.textContent = data.text;

        document.body.appendChild(div);

        try {
            const canvas = await html2canvas(div, { scale: 2 });
            canvas.toBlob((blob) => {
                saveAs(blob, 'post-text.png');
                document.body.removeChild(div);
            }, 'image/png');
        } catch (err) {
            console.error('Text image download failed:', err);
            document.body.removeChild(div);
        }
    };

    const handleClick = () => {
        if (hasImages && data.photos.length === 1) {
            const imageUrl = BASE_URL + data.photos[0].source;
            saveAs(imageUrl, 'post-image.jpg');
        } else if (hasImages && data.photos.length > 1) {
            setShowGallery(true);
        } else if (hasText) {
            downloadTextAsImage();
        }
    };

    const handleDownloadSelected = () => {
        selectedImages.forEach((url, index) => {
            saveAs(url, `image-${index + 1}.jpg`);
        });
        setShowGallery(false);
        setSelectedImages([]);
    };

    return (
        <>
            <Button
                variant="link"
                className="text-secondary border-0 bg-transparent p-0"
                onClick={handleClick}
                title="Download or View"
            >
                <i className="feather-download"></i>
            </Button>

            <Modal
                show={showGallery}
                onHide={() => setShowGallery(false)}
                dialogClassName="mobile-slide-modal custom-desktop-width"
                centered
                backdropClassName="custom-backdrop"
                backdrop
            >
                <Modal.Body className="post-modal-body px-3">
                    {/* Grabber and Close Button */}
                    <div className="d-flex justify-content-center position-relative mb-3">
                        <div className="grabber-bar" />
                        <Button
                            variant="light"
                            size="sm"
                            className="position-absolute end-0 top-0 m-2 rounded-circle"
                            onClick={() => setShowGallery(false)}
                        >
                            <i className="feather-x"></i>
                        </Button>
                    </div>

                    <h6 className="fw-bold mb-3 text-center">Select images to download</h6>

                    <Row className="g-3">
                        {data.photos?.map((photo, idx) => {
                            const imageUrl = BASE_URL + photo.source;
                            return (
                                <Col xs={6} key={idx} className="position-relative">
                                    <div
                                        className="post-image-card shadow rounded overflow-hidden"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => toggleSelectImage(photo.source)}
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`post-${idx}`}
                                            className="img-fluid w-100 h-100 object-fit-cover"
                                            style={{ aspectRatio: '1/1' }}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            className="position-absolute top-0 end-0 m-2"
                                            checked={selectedImages.includes(imageUrl)}
                                            readOnly
                                        />
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>

                    <div className="text-center mt-4">
                        <div className="mb-3 text-end fw-bold" style={{ color: '#8000ff' }}>
                            {selectedImages.length} image(s) selected
                        </div>
                        <Button
                            className="post-action-button"
                            onClick={handleDownloadSelected}
                            disabled={selectedImages.length === 0}
                        >
                            Download Selected
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default PostDownloadButton;
