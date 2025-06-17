import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

const PostCommentButton = ({ postId }) => {
    const navigate = useNavigate();
  const location = useLocation();

   

    const handleClick = () => {
    navigate(`/posts/${postId}`, {
      state: { backgroundLocation: location }
    });
  };

    return (
        <button 
            onClick={handleClick}
            className="text-secondary col border-0 bg-transparent p-0"
        >
            <i className='feather-message-square'></i> 2
        </button>
    );
};

export default PostCommentButton;

