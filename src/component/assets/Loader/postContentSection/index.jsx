import React from 'react';
import { Spinner } from 'react-bootstrap';
import './postContentSectionStyle.css'; // Assuming you have a CSS file for styles
const PostContentLoader = () => {
  return (
    <div className="post-content-loader">
      {/* Header loader */}
      <div className="d-flex align-items-center p-3 border-bottom">
        <div className="loader-avatar rounded-circle me-3"></div>
        <div>
          <div className="loader-line" style={{ width: '120px' }}></div>
          <div className="loader-line mt-1" style={{ width: '80px' }}></div>
        </div>
      </div>
      
      {/* Content loader */}
      <div className="p-3">
        <div className="loader-line mb-2"></div>
        <div className="loader-line mb-2" style={{ width: '90%' }}></div>
        <div className="loader-line" style={{ width: '70%' }}></div>
        
        {/* Image loader */}
        <div className="loader-image mt-3"></div>
      </div>
      
      {/* Footer loader */}
      <div className="p-3 border-top">
        <div className="d-flex justify-content-between">
          <div className="loader-line" style={{ width: '100px' }}></div>
          <div className="loader-line" style={{ width: '40px' }}></div>
        </div>
      </div>
      
      <Spinner animation="border" role="status" className="d-block mx-auto my-4">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default PostContentLoader;