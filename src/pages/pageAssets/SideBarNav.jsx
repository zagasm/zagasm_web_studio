import React from 'react';
import logo from '../../assets/zagasm_logo.png';
import { Link } from 'react-router-dom';
import './navStyle.css';
function SideBarNav() {
    return (
        <aside className="shadow-sm side_bar_container  " >
              <div class="box mb-3 rounded bg-whit list-sidebar">
                <ul class="list-group list-group-flush side_bar_nav">
                    <Link to="#" className=''>
                        <li class=" list-group-item pl-3 pr-3 d-flex align-items-center text-dark bg-none"><i class="feather-book mr-2 "></i> <span className='link_name'>New feed</span> <span class="ml-auto font-weight-bold fa fa-angle-right"></span></li>
                    </Link>
                    <Link to="#">
                        <li class="list-group-item pl-3 pr-3 d-flex align-items-center text-dark"><i class="feather-bookmark mr-2 "></i><span className='link_name'> Saved Posts</span></li>
                    </Link>
                     <Link to="chat">
                        <li class="list-group-item pl-3 pr-3 d-flex align-items-center text-dark"><i class="feather-message-square mr-2 "></i> <span className='link_name'>Messaging</span></li>
                    </Link>
                    {/*<Link to="#">
                        <li class="list-group-item pl-3 pr-3 d-flex align-items-center text-dark"><i class="feather-volume-2  mr-2 "></i> <span className='link_name'>Ads Manager</span> </li>
                    </Link>
                    <Link to="#">
                        <li class="list-group-item pl-3 pr-3 d-flex align-items-center text-dark"><i class="feather-credit-card mr-2 "></i> <span className='link_name'>Wallet</span> </li>
                    </Link> */}
                    <Link to="#">
                        <li class="list-group-item pl-3 pr-3 d-flex align-items-center text-dark"><i class="feather-search mr-2 "></i> <span className='link_name'>People</span> </li>
                    </Link>
                    <Link to="#">
                        <li class="list-group-item pl-3 pr-3 d-flex align-items-center text-dark"><i class="feather-flag mr-2 "></i> <span className='link_name'>Pages</span> </li>
                    </Link>
                </ul>
            </div>
            <div className="d-flex align-items-center osahan-post-header mb-3 people-list position-absolute bottom-0 ml-3">
                <div className="dropdown-list-image mr-3">
                    <img className="rounded-circle" src="./src/assets/img/IMG_9488.jpeg" alt="" />
                    <div className="status-indicator bg-success"></div>
                </div>
                <div className="font-weight-bold mr-2">
                    <div className="text-truncate">Tomilayo Barnabas</div>
                    <div className="small text-gray-500">@Username
                    </div>
                </div>
            </div>

        </aside>
    );
}

export default SideBarNav;
