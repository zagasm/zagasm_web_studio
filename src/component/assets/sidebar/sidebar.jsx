import React from "react";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Default styling
const Sidebar = () => {
  return (
    <div className="fixed-sidebar left">
      <div className="menu-left">
        <ul className="left-menu">
          <li className="">
            <div>
              <Tippy content={'Home'} placement="right">
                <Link
                  to="/feed">
                  <i className="fa-regular fa fa-home"></i>
                </Link>
              </Tippy>
            </div>

          </li>

          <li>
            <Tippy content={'Vilage square'} placement="right">
              <Link
                to="/Villagesquare"
              >
                <i className="fa-regular fa fa-users"></i>
              </Link>
            </Tippy>
          </li>
          <li>
            <Tippy content={'Market place'} placement="right">
              <Link
                to={'/market-place'}
                title="Market Place"
                data-toggle="tooltip"
                data-placement="right"
              >
                <i className="fa fa-shop"> </i>
              </Link>
            </Tippy>
          </li>

          <li>
            <Tippy content={'village Event'} placement="right">
              <Link
                to={"/events"}
                title="Community events"
                data-toggle="tooltip"
                data-placement="right"
              >
                <i className="fa-regular fa fa-bullhorn"></i>
              </Link>
            </Tippy>

          </li>
          <li>
            <Tippy content={'Advertisment'} placement="right">
              <Link


              >
                <i className="fa-regular fa fa-rectangle-ad"></i>
              </Link>
            </Tippy>

          </li>
          <li>
            <Tippy content={'Community leaders'} placement="right">

              <Link >
                <i className="fa-regular fa-users"></i>
              </Link>
            </Tippy>

          </li>
          <li>
            <Tippy content={'Settings'} placement="right">
              <Link
                to={"/settings"}
                title="Settings"
                data-toggle="tooltip"
                data-placement="right"
              >
                <i className="fa-regular fa-cog"></i>
              </Link>
            </Tippy>

          </li>
          <li>
            <Link
              title="Help"
              data-toggle="tooltip"
              data-placement="right"
            >
              <i className="fa-regular fa-question"></i>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
