import React from 'react';
import logo from '../../assets/zagasm_logo.png'; // Adjust path based on actual file location
import { Link } from 'react-router-dom';
function RightBarComponent({children}) {
    return (
        <aside className=" d-block d-md-none d-lg-block d-none w-100  right_side_bar "  >
            <div className="right_side_bar_inner_container "  >
               {children}
            </div>
        </aside>
    );
}
export default RightBarComponent;
