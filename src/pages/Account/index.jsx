import React, { useState } from "react";
import SideBarNav from "../pageAssets/SideBarNav";
import AccountHeading from "./AccountHeading";
import rocket from "../../assets/navbar_icons/rocket.png";
import Users_icon from "../../assets/navbar_icons/Users_icon.png";
import Bell from "../../assets/navbar_icons/Bell.png";
import login from "../../assets/navbar_icons/Login.png";
import { Link } from "react-router-dom";
import "./accountStyling.css";
import { useAuth } from "../auth/AuthContext";
import default_profilePicture from "../../assets/avater_pix.avif";
import { File, InfoIcon, Key, Laptop } from "lucide-react";
function Account() {
  const { user, logout } = useAuth();
  console.log(user);
  const Default_user_image = user?.profileUrl
    ? user.profileUrl
    : default_profilePicture;
  return (
    <div className="container-flui m-0 p-0">
      <SideBarNav />
      <div className="page_wrapper overflow-hidden">
        <div className="row p-0 ">
          <div className="col account_section ">
            <div className="row">
              <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 col-12 p-0 m-0">
                <AccountHeading />
              </div>
              <div className="col-xl-9 col-lg-8 col-md-7 col-sm-12 col-12 p-0 m-0">
                <div className="account_nav_section">
                  <div>
                    <div className="row">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 Preference_section">
                        <div className=" internal_container">
                          <h6>Preference</h6>
                          <ul>
                            <li>
                              <Link
                                to={"/account/interest"}
                                className=" account_link"
                              >
                                <div>
                                  <img src={rocket} alt="" />
                                  <span>Interest</span>
                                </div>
                                <div>
                                  <i className="fa fa-angle-right "></i>
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link
                                to={"/organizers"}
                                className=" account_link"
                              >
                                <div>
                                  <img src={Users_icon} alt="" />
                                  <span>Organizers you follow</span>
                                </div>
                                <div>
                                  <i className="fa fa-angle-right "></i>
                                </div>
                              </Link>
                            </li>
                            <li className="p-0 m-0" style={{ margin: "0px" }}>
                              <Link
                                to={"/account/manage-notification"}
                                className=" account_link"
                              >
                                <div>
                                  <img src={Bell} alt="" />
                                  <span>Manage notification</span>
                                </div>
                                <div>
                                  <i className="fa fa-angle-right "></i>
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <div className=" internal_container">
                          <h6>Help</h6>
                          <ul>
                            <li>
                              <Link
                                to={"/account/interest"}
                                className=" account_link"
                              >
                                <div>
                                  <InfoIcon />
                                  <span>Help Center</span>
                                </div>
                                <div>
                                  <i className="fa fa-angle-right "></i>
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <div className=" internal_container">
                          <h6>Legal</h6>
                          <ul>
                            <li>
                              <a
                                href={"https://api.studios.zagasm.com/legal/terms-of-service"}
                                className=" account_link"
                              >
                                <div>
                                  <File />
                                  <span>Terms of Service</span>
                                </div>
                                <div>
                                  <i className="fa fa-angle-right "></i>
                                </div>
                              </a>
                            </li>
                            <li>
                              <a
                                href="https://api.studios.zagasm.com/legal/privacy-policy"
                                className=" account_link"
                              >
                                <div>
                                  {/* <img src={rocket} alt="" /> */}
                                  <Laptop />
                                  <span>Accessibility</span>
                                </div>
                                <div>
                                  <i className="fa fa-angle-right "></i>
                                </div>
                              </a>
                            </li>
                            <li>
                              <a
                                to={"https://api.studios.zagasm.com/legal/privacy-policy"}
                                className=" account_link"
                              >
                                <div>
                                  <Key />
                                  <span>Privacy</span>
                                </div>
                                <div>
                                  <i className="fa fa-angle-right "></i>
                                </div>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-3 footer_section p-2 mb-3">
                      <span>Version</span>
                      <span>120.0382j2.465</span>
                    </div>
                    <Link
                      onClick={() => logout()}
                      className="p-2 tw:flex tw:items-center tw:gap-3 "
                    >
                      <img src={login} alt="" />{" "}
                      <span className="tw:text-red-500 tw:text-[14px]">
                        Sign out
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
