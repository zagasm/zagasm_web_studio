import React, { useState, useEffect } from 'react';
import friendImage from '../../assets/img/IMG_9488.jpeg';
import './style.css';
import SuggestedFriendsLoader from '../assets/Loader/SuggestedFriendsLoader';

function SuggestedFriends() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SuggestedFriendsLoader />;

  return (
    <div className="box shadow-s rounded bg-white mb-3" >
      <div className="box-title border-botto p-3">
        <h4 className="m-0 text-dark">People you might know</h4>
      </div>
      <div className="box-body p-3">
        {[...Array(5)].map((_, index) => (
          <div className="d-flex align-items-center osahan-post-header mb-3 people-list" key={index}>
            <div className="dropdown-list-image mr-3">
              <img className="rounded-circle" src={friendImage} alt="Friend" />
              <div className="status-indicator bg-success"></div>
            </div>
            <div className="font-weight-bold mr-2">
              <p className="text-truncate m-0">Tomilayo Barnabas</p>
              <span className="small text-gray-500">@Username</span>
            </div>
            <span className="ml-auto ">
              <button type="button" style={{background:'#EEDAFB'}} className="btn btn-sm">
               <span>Follow</span> <i className="feather-user-plus"></i>
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuggestedFriends;
