import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Image, Spinner } from 'react-bootstrap';
import { BsEmojiSmile } from 'react-icons/bs';
import { FiSend, FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi';
import TimeAgo from '../../assets/Timmer/timeAgo';
// import TimeAgo from '../assets/Timmer/timeAgo';
const CommentContainer = ({ post }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if ( post) {
            const timer = setTimeout(() => {
                fetchComments();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [post]);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);


        return () => window.removeEventListener('resize', handleResize);
    }, [ post]);

    const fetchComments = async () => {
        setLoadingComments(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const mockComments = [
                {
                    id: 1,
                    author: 'Jane Smith',
                    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
                    text: 'This is so cool! 😍',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    likes: 5
                },
                {
                    id: 2,
                    author: 'Mike Johnson',
                    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                    text: 'Great post! Where was this taken?',
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    likes: 2
                }
            ];
            setComments(mockComments);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const newCommentObj = {
            id: Date.now(),
            author: 'You',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            text: newComment,
            timestamp: new Date().toISOString(),
            likes: 0
        };

        setComments([newCommentObj, ...comments]);
        setNewComment('');
    };
    return (

        <div className={`comments-section ${isMobile ? 'mobile-comments' : ''}`}>
            <div className="comments-header p-3 border-bottom">
                <h5 className="mb-0">Comments</h5>
            </div>

            <div className="comments-list p-3">
                {loadingComments ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="comment-item mb-3 d-flex">
                            <Image
                                src={comment.avatar}
                                roundedCircle
                                width={32}
                                height={32}
                                className="me-2"
                            />
                            <div className="flex-grow-1">
                                <div className="bg-light rounded p-2">
                                    <strong>{comment.author}</strong>
                                    <p className="mb-0">{comment.text}</p>
                                </div>
                                <div className="d-flex align-items-center mt-1">
                                    <small className="text-muted me-2">
                                        <TimeAgo date={comment.timestamp} />
                                    </small>
                                    <Button variant="link" className="p-0 text-dark me-2" size="sm">
                                        Like
                                    </Button>
                                    <Button variant="link" className="p-0 text-dark" size="sm">
                                        Reply
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4 text-muted">
                        No comments yet
                    </div>
                )}
            </div>

            <div className="comment-form p-3 border-top">
                <Form onSubmit={handleSubmitComment} className="d-flex align-items-center">
                    <Button variant="link" className="p-0 me-2 text-dark">
                        <BsEmojiSmile size={24} />
                    </Button>
                    <Form.Control
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-grow-1 me-2"
                    />
                    <Button
                        variant="link"
                        className="p-0 text-primary"
                        type="submit"
                        disabled={!newComment.trim()}
                    >
                        <FiSend size={24} />
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default CommentContainer;

