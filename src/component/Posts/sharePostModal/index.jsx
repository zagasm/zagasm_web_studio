import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form, Spinner } from 'react-bootstrap';
import {
    FiShare2, FiLink, FiFacebook, FiTwitter,
    FiLinkedin, FiMessageSquare, FiX
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import shared_icon from '../../../assets/post_icon/shared_icon.svg';
function ShareButton({ sharesCount = 0, postUrl = '', postTitle = '' }) {
    const [showModal, setShowModal] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleShow = () => {
        setShowModal(true);
        setIsLoading(true);
        // Simulate loading for 1 second
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };
    const handleClose = () => setShowModal(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(postUrl).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => console.error('Failed to copy:', err));
    };
    const shareOnSocialMedia = (platform) => {
        const encodedUrl = encodeURIComponent(postUrl);
        const encodedTitle = encodeURIComponent(postTitle);
        const urls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            messenger: `fb-messenger://share/?link=${encodedUrl}`
        };

        if (urls[platform]) {
            window.open(urls[platform], '_blank', 'width=600,height=400');
        }
    };
    // Custom styles
    const styles = {
        primaryColor: '#8000FF',
        lightPurple: '#F0E6FF',
        darkPurple: '#4B0082',
        buttonHover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(128, 0, 255, 0.2)'
        },
        buttonActive: {
            transform: 'translateY(0)',
            boxShadow: 'none'
        }
    };

    return (
        <>
            <Button
                variant="light"
                onClick={handleShow}
                className="d-flex align-items-center border-none post_icon"
                style={{background:'none', border:'none', outline:'none'}}
            >
                <img src={shared_icon} className="me-1 post_icon" />
                <span style={{ fontWeight: 500 }}></span>
            </Button>

            <Modal
            backdrop="static"
                show={showModal}
                onHide={handleClose}
                centered
                contentClassName="border-0"
            >
                <Modal.Header
                    closeButton
                    style={{
                        backgroundColor: 'white',
                        color: styles.primaryColor,
                    }}
                >
                    <Modal.Title className="fw-bold">
                        <FiShare2 className="me-2" />
                        Share this post
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ padding: '25px', minHeight: '300px', position: 'relative' }}>
                    {isLoading ? (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center'
                        }}>
                            <Spinner
                                animation="border"
                                variant="primary"
                                style={{
                                    color: styles.primaryColor,
                                    width: '3rem',
                                    height: '3rem'
                                }}
                            />
                            <p className="mt-3" style={{ color: styles.primaryColor }}>Loading share options...</p>
                        </div>
                    ) : (
                        <>
                            <Row className="g-3 mb-4">
                                <Col xs={4}>
                                    <Button
                                        variant="light"
                                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                                        onClick={copyToClipboard}
                                        style={{
                                            borderRadius: '10px',
                                            backgroundColor: isCopied ? styles.lightPurple : 'white',
                                            color: styles.primaryColor,
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style = { ...e.currentTarget.style, ...styles.buttonHover }}
                                        onMouseLeave={(e) => e.currentTarget.style = { ...e.currentTarget.style, ...styles.buttonActive }}
                                    >
                                        <FiLink size={24} className="mb-2" />
                                        <span className="small fw-medium">{isCopied ? 'Copied!' : 'Copy link'}</span>
                                    </Button>
                                </Col>
                                <Col xs={4}>
                                    <Button
                                        variant="light"
                                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                                        onClick={() => shareOnSocialMedia('facebook')}
                                        style={{
                                            border: '1px solid #1877F2',
                                            borderRadius: '10px',
                                            color: '#1877F2',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style = { ...e.currentTarget.style, ...styles.buttonHover }}
                                        onMouseLeave={(e) => e.currentTarget.style = { ...e.currentTarget.style, ...styles.buttonActive }}
                                    >
                                        <FiFacebook size={24} className="mb-2" />
                                        <span className="small fw-medium">Facebook</span>
                                    </Button>
                                </Col>
                                <Col xs={4}>
                                    <Button
                                        variant="light"
                                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                                        onClick={() => shareOnSocialMedia('twitter')}
                                        style={{
                                            border: '1px solid #1DA1F2',
                                            borderRadius: '10px',
                                            color: '#1DA1F2',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style = { ...e.currentTarget.style, ...styles.buttonHover }}
                                        onMouseLeave={(e) => e.currentTarget.style = { ...e.currentTarget.style, ...styles.buttonActive }}
                                    >
                                        <FiTwitter size={24} className="mb-2" />
                                        <span className="small fw-medium">Twitter</span>
                                    </Button>
                                </Col>
                                <Col xs={4}>
                                    <Button
                                        variant="light"
                                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                                        onClick={() => shareOnSocialMedia('linkedin')}
                                        style={{
                                            border: '1px solid #0A66C2',
                                            borderRadius: '10px',
                                            color: '#0A66C2',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style = { ...e.currentTarget.style, ...styles.buttonHover }}
                                        onMouseLeave={(e) => e.currentTarget.style = { ...e.currentTarget.style, ...styles.buttonActive }}
                                    >
                                        <FiLinkedin size={24} className="mb-2" />
                                        <span className="small fw-medium">LinkedIn</span>
                                    </Button>
                                </Col>
                                <Col xs={4}>
                                    <Button
                                        variant="light"
                                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                                        onClick={() => shareOnSocialMedia('whatsapp')}
                                        style={{
                                            border: '1px solid #25D366',
                                            borderRadius: '10px',
                                            color: '#25D366',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style = { ...e.currentTarget.style, ...styles.buttonHover }}
                                        onMouseLeave={(e) => e.currentTarget.style = { ...e.currentTarget.style, ...styles.buttonActive }}
                                    >
                                        <FaWhatsapp size={24} className="mb-2" />
                                        <span className="small fw-medium">WhatsApp</span>
                                    </Button>
                                </Col>
                                <Col xs={4}>
                                    <Button
                                        variant="light"
                                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                                        onClick={() => shareOnSocialMedia('messenger')}
                                        style={{
                                            border: '1px solid #006AFF',
                                            borderRadius: '10px',
                                            color: '#006AFF',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style = { ...e.currentTarget.style, ...styles.buttonHover }}
                                        onMouseLeave={(e) => e.currentTarget.style = { ...e.currentTarget.style, ...styles.buttonActive }}
                                    >
                                        <FiMessageSquare size={24} className="mb-2" />
                                        <span className="small fw-medium">Messenger</span>
                                    </Button>
                                </Col>
                            </Row>

                            <Form.Group>
                                <div className="d-flex" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                                    <Form.Control
                                        type="hidden"
                                        readOnly
                                        value={postUrl}
                                        onClick={(e) => e.target.select()}
                                        style={{
                                            borderRight: 'none',
                                            borderRadius: '8px 0 0 8px'
                                        }}
                                    />
                                </div>
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ShareButton;