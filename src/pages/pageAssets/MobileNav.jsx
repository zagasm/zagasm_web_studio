import React from 'react';
import logo from '../../assets/zagasm_logo.png'; // Adjust path based on actual file location
import './navStyle.css';
function MobileNav() {
    return (
        <div className="shadow-sm mobile_navbar_container " >
            <div class="box  rounded list-sideba " >
                <ul class=" side_bar_na p-0" >
                      <li className=''>
                        <i class="feather-home"></i> <span className="mobile_icon_name">Home</span>
                    </li>
                    <li className=''>
                        <i class="feather-search"></i>  <span className="mobile_icon_name">Explore</span>
                    </li>
                  
                    <li>
                        <i class="feather-plus"></i>
                    </li>
                    <li className='active'>
                        <i class="feather-user "></i> <span className="mobile_icon_name">Profile</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default MobileNav;
