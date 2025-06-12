import React from 'react';

// Import images properly
import logo3 from '../../assets/img/l3.png';
import logo4 from '../../assets/img/l4.png';

function SideAds() {
    return (
        <div className="box shadow-sm border rounded bg-white mb-3">
            <div className="box-title border-bottom p-3">
                <h6 className="m-0">Ads</h6>
            </div>
            <div className="box-body p-3">
                <a href="job-profile.html">
                    <div className="shadow-sm border rounded bg-white job-item mb-3">
                        <div className="d-flex align-items-center p-3 job-item-header">
                            <div className="overflow-hidden mr-2">
                                <h6 className="font-weight-bold text-dark mb-0 text-truncate">Product Director</h6>
                                <div className="text-truncate">Spotify Inc.</div>
                                <div className="small text-gray-500"><i className="feather-map-pin"></i> Ghana, Accra</div>
                            </div>
                            <img className="img-fluid ml-auto" src={logo3} alt="Spotify Logo" />
                        </div>
                        <div className="d-flex align-items-center border-bottom job-item-body"></div>
                        <div className="p-3 job-item-footer">
                            <small className="text-gray-500"><i className="feather-clock"></i> Posted 17 Days ago</small>
                        </div>
                    </div>
                </a>
                <a href="job-profile.html">
                    <div className="shadow-sm border rounded bg-white job-item">
                        <div className="d-flex align-items-center p-3 job-item-header">
                            <div className="overflow-hidden mr-2">
                                <h6 className="font-weight-bold text-dark mb-0 text-truncate">.NET Developer</h6>
                                <div className="text-truncate">Invision</div>
                                <div className="small text-gray-500"><i className="feather-map-pin"></i> Nigeria, Lagos</div>
                            </div>
                            <img className="img-fluid ml-auto" src={logo4} alt="Invision Logo" />
                        </div>
                        <div className="d-flex align-items-center border-bottom job-item-body"></div>
                        <div className="p-3 job-item-footer">
                            <small className="text-gray-500"><i className="feather-clock"></i> Posted 3 Days ago</small>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}

export default SideAds;
