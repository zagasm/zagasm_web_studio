import React from 'react';
import PropTypes from 'prop-types';
import './postFormattingstyle.css';

const PostTextFormatter = ({ htmlContent }) => {
  const createMarkup = () => {
    // First, decode HTML entities
    const decoded = new DOMParser().parseFromString(htmlContent, 'text/html').body.textContent;
    
    // Then reconstruct with proper formatting
    const formatted = decoded
      .replace(/\n/g, '<br />') // Preserve newlines
      .replace(/<a /g, '<a target="_blank" rel="noopener noreferrer nofollow" class="formatted-link" ');

    return { __html: formatted };
  };

  return (
    <div 
      className="post-html-content"
      dangerouslySetInnerHTML={createMarkup()}
    />
  );
};

PostTextFormatter.propTypes = {
  htmlContent: PropTypes.string.isRequired,
};

export default PostTextFormatter;