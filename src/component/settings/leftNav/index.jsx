import React, { useState } from "react";
import "./leftNavstyle.css";
import { Link } from "react-router-dom";

const SettingsNavBar = () => {
  const [droper, DropdownHeader] = useState(true);
  return (
    <div className="central-meta col-lg-3">
      <div className="navhead ">
        <h3>Navigation</h3>
        <h4 onClick={() => DropdownHeader(!droper)} href="#shoppingbag">
          <i

            className="fa fa-sliders"
          ></i>
        </h4>
      </div>
      <div className={droper ? 'nav_visible settingsNavCon' : "settingsNavCon "}>
        <div className="about ">
          <div className="d-flex flex-row mt-2">
            <ul className="nav nav-tabs nav-tabs--vertical nav-tabs--left settingNavcontainer  ">
              <li>
                <h4 className="ml-3">Settings</h4>
              </li>
              <li className="nav-item">
                <Link onClick={() => DropdownHeader(!droper)}
                  to={"/settings/profile"}
                  className="nav-link"
                  data-toggle="tab"
                >
                  <i className="fa-regular fa-pen-to-square"></i> Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link onClick={() => DropdownHeader(!droper)} to={"/settings"} className="nav-link" data-toggle="tab">
                  <i className="fa-regular fa-gear"></i> Account
                </Link>
              </li>

              <li className="nav-item">
                <Link onClick={() => DropdownHeader(!droper)}
                  to={"/settings/notification"}
                  className="nav-link"
                  data-toggle="tab">
                  <i className="fa-regular fa-bell"></i> Notification and privacy
                </Link>
              </li>

              <li className="nav-item">
                <Link onClick={() => DropdownHeader(!droper)}
                  to={"/settings/market-place/registration"} href="#messages" className="nav-link" data-toggle="tab">
                  <i className="fa-sharp fa-regular fa-shop"></i> POKI Market
                </Link>
              </li>
              <li className="nav-item">
                <Link to={'/settings/wallet'} className="nav-link" data-toggle="tab">
                  <i className="fa-sharp fa-regular fa-wallet"></i>POKI Wallet
                </Link>
              </li>
              <li className="nav-item">
                <a href="#messages" className="nav-link" data-toggle="tab">
                  <i className="fa-sharp fa-regular fa-rectangle-ad"></i>My Ads
                </a>
              </li>
              <li className="nav-item">
                <Link to={'wallet/transaction-history'} className="nav-link" data-toggle="tab">
                  <i className="fa-sharp fa-regular fa-bank"></i>Payment History
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsNavBar;
