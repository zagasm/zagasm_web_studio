// SuggestedFriendsLoader.js
import React from 'react';
import './style.css'; // Reuse the same CSS file or create another

function SuggestedFriendsLoader() {
  return (
    <div className="box shadow-sm rounded bg-white mb-3 rightBarPeopleSuggestedLoader" style={{ marginTop: '65px' }}>
      <div className="box-title border-botto p-3">
        <h6 className="m-0">People you might know</h6>
      </div>
      <div className="box-body p-3">
        {[...Array(8)].map((_, index) => (
          <div className="d-flex align-items-center osahan-post-header mb-3 people-list" key={index}>
            <div className="dropdown-list-image mr-3 shimmer-circle"></div>
            <div className="font-weight-bold mr-2" style={{ flexGrow: 1 }}>
              <div className="shimmer-line w-75 mb-1"></div>
              <div className="shimmer-line w-50"></div>
            </div>
            <span className="ml-auto shimmer-button" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuggestedFriendsLoader;
