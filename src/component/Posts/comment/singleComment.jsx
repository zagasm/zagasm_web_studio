import React from 'react';
import { Image, Button } from 'react-bootstrap';
import TimeAgo from '../../assets/Timmer/timeAgo';

const SingleComment = ({ comment }) => {
    return (
        <div className="comment-item mb-3 d-flex">
            <a href={comment.author_url} target="_blank" rel="noopener noreferrer">
                <Image
                    src={comment.avatar}
                    roundedCircle
                    width={32}
                    height={32}
                    className="me-2"
                    alt={comment.author}
                />
            </a>
            <div className="flex-grow-1">
                <div className="bg-light rounded p-2">
                    <a
                        href={comment.author_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark text-decoration-none"
                    >
                        <strong>{comment.author}</strong>
                    </a>
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{comment.text}</p>
                </div>
                <div className="d-flex align-items-center mt-1">
                    <small className="text-muted me-2">
                        <TimeAgo date={comment.timestamp} />
                    </small>
                    <Button variant="link" className="p-0 text-muted me-2" size="sm">
                        {comment.likes} Like{comment.likes !== 1 ? 's' : ''}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SingleComment;
