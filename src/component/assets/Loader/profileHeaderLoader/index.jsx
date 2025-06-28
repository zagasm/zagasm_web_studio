import React from 'react';
import './ShimmerLoader.css';

function ShimmerLoader() {
    return (
        <div className="profile-wrapper">
            {/* Cover Photo Loader */}
            <div className="cover-photo-container"
                style={{
                    marginTop: '65px',
                    height: '200px',
                    position: 'relative'
                }}
            >
                <div className="cover-photo shimmer"></div>
            </div>

            {/* Profile Info Section */}
            <div className="profile-info-section bg-white shadow-sm">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="profile-header d-flex flex-column flex-md-row align-items-center py-3">

                                <div className="profile-picture-container shimmer-circle"></div>

                                <div className="profile-details w-100 px-3">
                                    <div className="shimmer shimmer-line w-50 mb-2  m-auto "></div>
                                    <div className="shimmer shimmer-line w-25 mb-3"></div>

                                    <div className="d-flex">
                                        <div className="stat-item text-center mx-3">
                                            <div className="shimmer shimmer-line w-50 mb-1"></div>
                                            <div className="shimmer shimmer-line w-75"></div>
                                        </div>
                                        <div className="stat-item text-center mx-3">
                                            <div className="shimmer shimmer-line w-50 mb-1"></div>
                                            <div className="shimmer shimmer-line w-75"></div>
                                        </div>
                                        <div className="stat-item text-center mx-3">
                                            <div className="shimmer shimmer-line w-50 mb-1"></div>
                                            <div className="shimmer shimmer-line w-75"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-actions mt-3 mt-md-0 ml-md-auto">
                                    <div className="shimmer shimmer-button"></div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="profile-navigation bg-white border-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 d-flex justify-content-center">
                            <div className="shimmer shimmer-tab mx-2"></div>
                            <div className="shimmer shimmer-tab mx-2"></div>
                            <div className="shimmer shimmer-tab mx-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShimmerLoader;
