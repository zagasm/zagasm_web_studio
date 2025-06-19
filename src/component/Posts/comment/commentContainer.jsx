import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { BsEmojiSmile } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import SingleComment from './singleComment';
import axios from 'axios';
import { useAuth } from '../../../pages/auth/AuthContext';
import { showToast } from '../../ToastAlert';

const CommentContainer = ({ post, comment_data }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiButtonRef = useRef(null);

    useEffect(() => {
        if (comment_data && comment_data.length > 0) {
            const formattedComments = comment_data.map(comment => ({
                id: comment.comment_id,
                author: comment.author_name || comment.user_name,
                avatar: comment.author_picture ||
                    (comment.user_picture
                        ? `https://zagasm.com/content/uploads/${comment.user_picture}`
                        : 'https://zagasm.com/content/themes/default/images/blank_profile.png'),
                text: comment.text_plain || comment.text,
                timestamp: comment.time,
                likes: comment.reactions_total_count || 0,
                author_url: comment.author_url
            }));
            setComments(formattedComments);
        }

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [comment_data]);

    const postCommentToAPI = async (commentText) => {
        try {
            const formData = new FormData();
            formData.append('post_id', post.post_id);
            formData.append('message', commentText);
            formData.append('user_id', user?.user_id || '0');
            formData.append('api_secret_key', 'Zagasm2025!Api_Key_Secret');

            const response = await axios.post(
                'https://zagasm.com/includes/ajax/posts/add_comment.php',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                }
            );
            return response.data.comment;
        } catch (error) {
            console.error('Error posting comment:', error.message);
            throw error;
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);

        const tempComment = {
            id: Date.now(),
            author: user?.username || 'You',
            avatar: user?.profile_picture || 'https://randomuser.me/api/portraits/men/1.jpg',
            text: newComment,
            timestamp: new Date().toISOString(),
            likes: 0,
            author_url: '#',
            isPending: true
        };

        try {
            setComments([tempComment, ...comments]);
            setNewComment('');

            const apiComment = await postCommentToAPI(newComment);

            setComments(prev =>
                prev.map(comment =>
                    comment.id === tempComment.id
                        ? {
                              ...comment,
                              id: apiComment.comment_id,
                              timestamp: apiComment.time,
                              isPending: false
                          }
                        : comment
                )
            );
        } catch (error) {
            setComments(prev => prev.filter(comment => comment.id !== tempComment.id));
            showToast.error(error.response?.data?.message || 'Failed to post comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmojiClick = (emojiData) => {
        setNewComment(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiButtonRef.current && !emojiButtonRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            className={`comments-section ${isMobile ? 'mobile-comments' : ''}`}
            style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}
        >
            <div className="comments-header p-3 border-bottom">
                <h5 className="mb-0">Comments ({comments.length})</h5>
            </div>

            <div
                className="comments-list p-3"
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    marginBottom: isMobile ? '60px' : '0'
                }}
            >
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <SingleComment key={comment.id} comment={comment} isPending={comment.isPending} />
                    ))
                ) : (
                    <div className="text-center py-4 text-muted">No comments yet</div>
                )}
            </div>

            <div
                className="comment-form p-3 border-top"
                style={{
                    position: isMobile ? 'fixed' : 'sticky',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'white',
                    zIndex: 1000,
                    borderTop: '1px solid #dee2e6'
                }}
            >
                <Form onSubmit={handleSubmitComment} className="d-flex align-items-center">
                    <div ref={emojiButtonRef} style={{ position: 'relative' }}>
                        <Button variant="link" className="p-0 me-2 text-muted" onClick={toggleEmojiPicker}>
                            <BsEmojiSmile size={24} />
                        </Button>

                        {showEmojiPicker && (
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '45px',
                                    left: 0,
                                    zIndex: 1100,
                                    background: '#fff',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }}
                            >
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    width={300}
                                    height={350}
                                    emojiStyle="native"
                                    searchDisabled={false}
                                    previewConfig={{ showPreview: false }}
                                    skinTonesDisabled={false}
                                    lazyLoadEmojis={true}
                                />
                            </div>
                        )}
                    </div>

                    <Form.Control
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-grow-1 me-2"
                        disabled={isSubmitting}
                    />

                    <Button
                        variant="link"
                        className="p-0 text-primary"
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                    >
                        {isSubmitting ? <Spinner animation="border" size="sm" /> : <FiSend size={24} />}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default CommentContainer;
