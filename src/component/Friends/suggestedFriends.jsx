import React from 'react';
import friendImage from '../../assets/img/IMG_9488.jpeg'; // Adjust the path accordingly
import './style.css';

function SuggestedFriends() {
    return (
        <div className="box shadow-sm rounded bg-white mb-3" style={{ marginTop: '65px' }}>
            <div className="box-title border-botto p-3">
                <h6 className="m-0">People you might know</h6>
            </div>
            <div className="box-body p-3">
                {[...Array(12)].map((_, index) => (
                    <div className="d-flex align-items-center osahan-post-header mb-3 people-list" key={index}>
                        <div className="dropdown-list-image mr-3">
                            <img className="rounded-circle" src={friendImage} alt="Friend" />
                            <div className="status-indicator bg-success"></div>
                        </div>
                        <div className="font-weight-bold mr-2">
                            <div className="text-truncate">Tomilayo Barnabas</div>
                            <div className="small text-gray-500">Username</div>
                        </div>
                        <span className="ml-auto">
                            <button type="button" className="btn btn-light btn-sm">
                                <i className="feather-user-plus"></i>
                            </button>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SuggestedFriends;
