import Pokilogo_light from "../../../assets/zagasm_studio_logo.png";
import "./style.css";
import RightSlider from "../../rightModal";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../pages/auth/AuthContext";
import Dropdown from "../Dropdown";
import profileImg from '../../../assets/images/profileImg/profile-img.jpg'
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Default styling
import NotificationsHeaderSection from "../../Notification/notification_header";
import UnreadNotificationCounter from "../../Notification/countUnreadNotification";
import CoinBalance from "../PokiCoin/availableCoinTempView";
import { useParams } from 'react-router-dom';
function Header() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const [currentPage, setcurrentPage] = useState('');
  // const navigate = useNavigate();
  console.log(user);
  useEffect(() => {
    const pathname = window.location.pathname;
    const secondLayer = pathname.split('/')[1];

    if (secondLayer) {
      setcurrentPage(secondLayer);
    } else {
      setcurrentPage("POKI VILLAGE");
    }
  }, [])
  return (
    <>
      {/* header */}
      <div class="theme-layout">
        <div
          className="responsive-header"
          style={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.39)" }}
        >
          <div
            className="mh-hea   top_nav m-0 "

          >
            <Link to={"/"} className="mh-btns-lef" >
              {/* <img src={Pokilogo_light} style={{ width: "40%" }} alt="Logo" /> */}
            </Link>
            <span style={{ fontSize: '20px' }} onClick={() => setIsOpen(!isOpen)} className="mh-btns-right">
              <a className="fa fa-sliders" ></a>
            </span>
          </div>
          <div
            className="mh-hea firs Stic m-0 link_nav"

          >
            <ul className="menuNav row">
              <li className="col">
                <Tippy content={'Home'} placement="bottom">
                  <Link
                    to="/">
                    <i className="fa-regular fa fa-home"></i>
                  </Link>
                </Tippy>
              </li>
              <li className="col text-center">
                <Tippy content={'Village square'} placement="bottom">
                  <Link
                    to="/Villagesquare"
                  >
                    <i className="fa-regular fa fa-users"></i>
                  </Link>
                </Tippy>
              </li>
              <li className="col text-center">
                <Tippy content={'Advertize on POKI VILLAGE'} placement="bottom">
                  <Link

                  >
                    <i className="fa-regular fa fa-ad"></i>
                  </Link>
                </Tippy>
              </li>

              <li className="col text-center">
                <Tippy content={'Market Place'} placement="bottom">
                  <Link >
                    <i className="fa-regular fa fa-shop"></i>
                  </Link>
                </Tippy>
              </li>

              <li className="col text-center">
                <Tippy content={'Community events'} placement="bottom">
                  <Link
                    to={"/events"}
                  >
                    <i className="fa-regular fa fa-bullhorn"></i>
                  </Link>
                </Tippy>
              </li>


              <li className="col text-right">
                <Link >
                  <i className="fa-regular fa-question"></i>
                </Link>
              </li>
            </ul>
          </div>

          <div
            className=" mobile_search_form"

          >
            <div className="user-img ">
              {user ? (

                <>
                  <Link to={'settings/profile'}>
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        // marginLeft:"-10px",
                        border: "1px solid white",
                      }}
                      src={user.profile_image_id ? import.meta.env.VITE_API_URL + user.profile_image_id : profileImg}
                      alt=""
                    />
                  </Link>
                  {/* tomilayo */}
                  {/* <span className="status f-online"></span> */}
                </>

              ) : (
                <Link
                  to={'/auth/signin'}
                  className="btn "
                  style={{ color: "black", background: "white", borderRadius: '40%' }}

                >
                  <span

                    title="Village square"
                    data-toggle="tooltip"
                    data-placement="right"
                  >
                    <i className="fa-sharp fa-solid fa-user"></i>
                  </span>
                </Link>
              )}
            </div>
            <div className="top-search mt-1 ">
              <form method="post" className="" style={{ width: "100%" }}>
                <input
                  style={{ height: "40px", }}
                  type="text"
                  placeholder="Search Communities, Discussion"
                />
                <button type="button" data-ripple>
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      data-name="Layer 1"
                      viewBox="0 0 512 512"
                      className="search-icon"
                      height="15px"
                      width="15px"
                    >
                      <path d="M455 455a25 25 0 01-35.4 0l-81.3-81.2a32.2 32.2 0 01-.9-44.7 137 137 0 00-101-229.5h-.5a136 136 0 00-97 40.9 137.3 137.3 0 00.6 192.7 136.4 136.4 0 00139.2 33.6 25 25 0 0115.3 47.6 187 187 0 01-190-46 187.5 187.5 0 01-.8-263 185.6 185.6 0 01132.5-55.8h.8A187 187 0 01385 350l69.9 69.8a25 25 0 010 35.4z"></path>
                      <path d="M0 0h512v512H0z" fill="none"></path>
                    </svg>
                  </i>
                </button>
              </form>
            </div>
          </div>

          <RightSlider isOpen={isOpen} setIsOpen={() => setIsOpen(!isOpen)}>
            <nav style={{ zIndex: "99999" }}>
              <div>
                <div className="right_nav_bar">
                  <Link
                    to={"/settings/profile"}
                    onClick={() => setIsOpen(!isOpen)}
                    className=" "
                  >
                    <span>Profile</span>
                    <span className="fa fa-user"></span>
                  </Link>
                  <Link className="">
                    <span>Advertize</span>
                    <span className="fa fa-rectangle-ad"></span>
                  </Link>

                  <Link className="">
                    <span>About POKI</span>
                    <span className="fa fa-ethernet"></span>
                  </Link>

                  <Link to={'/villagesquare'} onClick={() => setIsOpen(!isOpen)}>
                    <span>POKI village</span>
                    <span className="fa-sharp fa fa-users"></span>
                  </Link>
                  <Link
                    onClick={() => setIsOpen(!isOpen)}
                    to={"/settings"}
                    className=""
                  >
                    <span>Acount settings</span>
                    <span className="fa fa-cog"></span>
                  </Link>
                  {user && <Link
                    onClick={() => logout()}
                    className=""
                  >
                    <span>Sign out</span>
                    <span className="ti-power-off"></span>
                  </Link>}
                </div>
              </div>
            </nav>
          </RightSlider>
        </div>

        <div className="topbar stick">
          <div className="logo">
            <img src={Pokilogo_light} style={{ width: "75%" }} alt="Zagasm Studios Logo" />
          </div>
          <div className="top-area">
            <div className="main-menu">
              <span>
                <i className="fa-regular fa-square-question"></i>
              </span>
            </div>
            <div className="top-search">
              <form method="post" className="">
                <input
                  type="text"
                  placeholder="Search People, Pages, Groups etc"
                />
                <button type="button" data-ripple>
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      data-name="Layer 1"
                      viewBox="0 0 512 512"
                      className="search-icon"
                      height="15px"
                      width="15px"
                    >
                      <path d="M455 455a25 25 0 01-35.4 0l-81.3-81.2a32.2 32.2 0 01-.9-44.7 137 137 0 00-101-229.5h-.5a136 136 0 00-97 40.9 137.3 137.3 0 00.6 192.7 136.4 136.4 0 00139.2 33.6 25 25 0 0115.3 47.6 187 187 0 01-190-46 187.5 187.5 0 01-.8-263 185.6 185.6 0 01132.5-55.8h.8A187 187 0 01385 350l69.9 69.8a25 25 0 010 35.4z"></path>
                      <path d="M0 0h512v512H0z" fill="none"></path>
                    </svg>
                  </i>
                </button>
              </form>
            </div>
            <div className="page-name">
              <span>{ "people of knowledge and innovation"}</span>
            </div>
            <ul className="setting-area float-left">
              <li>
                <Link to={'/'} title="Home" data-ripple="">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 514 458.5"
                      className=""
                      height="15px"
                      fill="white"
                    >
                      <path d="M507 185.7L315.7 20.9C283.6-6.7 236.8-7 204.3 20.2L7.2 185.5c-8.5 7.1-9.6 19.7-2.5 28.2 4 4.7 9.6 7.2 15.3 7.2s9.1-1.5 12.8-4.7l25.6-21.4v165.4c.9 54.4 45.4 98.4 100 98.4h197.2c54.6 0 99.1-44 100-98.4V194.3l25.4 21.8c8.4 7.2 21 6.3 28.2-2.1 7.2-8.4 6.3-21-2.1-28.2zM298.7 418.5h-83.5v-65.7c0-23 18.7-41.8 41.8-41.8s41.8 18.7 41.8 41.8v65.7zm116.8-60c0 33.1-26.9 60-60 60h-16.8v-65.7c0-45.1-36.7-81.8-81.8-81.8s-81.8 36.7-81.8 81.8v65.7h-16.8c-33.1 0-60-26.9-60-60V161.2L230 50.9c17.4-14.6 42.4-14.4 59.6.4l126 108.5v198.7z"></path>
                    </svg>
                  </i>
                </Link>
              </li>

              <li>
                <Dropdown
                  title={
                    <>
                      <i>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-bell"
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                      </i>
                      <em className="bg-purple">  {user && <NotificationsHeaderSection type={'counter'} userId={user.user_id} />}</em>
                    </>
                  }
                >
                  <div className="dropdowns">
                    <span>
                      {user && <NotificationsHeaderSection type={'counter'} userId={user.user_id} />} new notification(s)

                      {/* <a href="#" title="">
                      Mark all as read
                    </a> */}
                    </span>
                    <ul className="drops-menu">
                      {user && <NotificationsHeaderSection type={'header_notification'} userId={user.user_id} />}
                    </ul>
                    {/* <a href="notifications.html" title="" className="more-mesg">
                    View All
                  </a> */}
                  </div>
                </Dropdown>
              </li>
              <li>
                <Dropdown
                  title={
                    <>
                      <i>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-message-square"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </i>
                      <em className="bg-blue">9</em>
                    </>
                  }
                >
                  <div className="dropdowns">
                    {/* <span>
                  5 New Messages{" "}
                  <a href="#" title="">
                    Mark all as read
                  </a>
                </span> */}
                    <ul className="drops-menu">
                      <li className="text-center pt-2">
                        No message is available
                      </li>
                      {/* <li>
                    <a className="show-mesg" href="#" title="">
                      <figure>
                        <img
                          src="../../../src/assets/images/resources/thumb-1.jpg"
                          alt=""
                        />
                        <span className="status f-online"></span>
                      </figure>
                      <div className="mesg-meta">
                        <h6>sarah Loren</h6>
                        <span>
                          <i className="ti-check"></i> Hi, how r u dear ...?
                        </span>
                        <i>2 min ago</i>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a className="show-mesg" href="#" title="">
                      <figure>
                        <img
                          src="../../../src/assets/images/resources/thumb-2.jpg"
                          alt=""
                        />
                        <span className="status f-offline"></span>
                      </figure>
                      <div className="mesg-meta">
                        <h6>Jhon doe</h6>
                        <span>
                          <i className="ti-check"></i> We’ll have to check that
                          at the office and see if the client is on board.
                        </span>
                        <i>2 min ago</i>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a className="show-mesg" href="#" title="">
                      <figure>
                        <img
                          src="../../../src/assets/images/resources/thumb-3.jpg"
                          alt=""
                        />
                        <span className="status f-online"></span>
                      </figure>
                      <div className="mesg-meta">
                        <h6>Andrew</h6>
                        <span>
                          <i className="fa fa-paperclip"></i> Hi Jack's! It’s
                          Diana, I just wanted to let you know that we have to
                          reschedule..
                        </span>
                        <i>2 min ago</i>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a className="show-mesg" href="#" title="">
                      <figure>
                        <img
                          src="../../../src/assets/images/resources/thumb-4.jpg"
                          alt=""
                        />
                        <span className="status f-offline"></span>
                      </figure>
                      <div className="mesg-meta">
                        <h6>Tom cruse</h6>
                        <span>
                          <i className="ti-check"></i> Great, I’ll see you
                          tomorrow!.
                        </span>
                        <i>2 min ago</i>
                      </div>
                    </a>
                    <span className="tag">New</span>
                  </li>
                  <li>
                    <a className="show-mesg" href="#" title="">
                      <figure>
                        <img
                          src="../../../src/assets/images/resources/thumb-5.jpg"
                          alt=""
                        />
                        <span className="status f-away"></span>
                      </figure>
                      <div className="mesg-meta">
                        <h6>Amy</h6>
                        <span>
                          <i className="fa fa-paperclip"></i> Sed ut
                          perspiciatis unde omnis iste natus error sit{" "}
                        </span>
                        <i>2 min ago</i>
                      </div>
                    </a>
                    <span className="tag">New</span>
                  </li> */}
                    </ul>
                    {/* <a href="chat-messenger.html" title="" className="more-mesg">
                  View All
                </a> */}
                  </div>
                </Dropdown>
              </li>
            </ul>
            <div className="user-img">
              <div className="user-img pr-5">
                {/* <h5 title="available POKI coin"> <b className="badge" style={{ background: '#FA6342' }}><i class="fa-solid fa-coins"></i> 0.00</b></h5> */}
                <CoinBalance balance={42.75} iconColor="#fa6342" balanceColor="" />
                <div className="pr-4"></div>
              </div>
            </div>

            <div className="user-img">
              {user ? (
                <>
                  <Dropdown
                    title={
                      <div className="user-img">
                        <h5>{user.username ? user.username.length > 15 ? user.username.slice(0, 15) + '...' : user.username : null}</h5>
                        <img
                          style={{ width: "50px", height: "50px" }}
                          src={user.profile_image_id ? import.meta.env.VITE_API_URL + user.profile_image_id : profileImg}
                          alt=""
                        />
                        {/* <span className="status f-online"></span> */}
                      </div>
                    }
                  >
                    <div className="user-setting">
                      <span className="seting-title">
                        User setting{" "}
                        <a href="#" title="">
                          see all
                        </a>
                      </span>
                      <ul className="log-out">
                        <li>
                          <a href="about.html" title="">
                            <i className="ti-user"></i> view profile
                          </a>
                        </li>
                        <li>
                          <a href="setting.html" title="">
                            <i className="ti-pencil-alt"></i> edit profile
                          </a>
                        </li>
                        <li>
                          <a href="#" title="">
                            <i className="ti-target"></i> activity log
                          </a>
                        </li>
                        <li>
                          <a href="setting.html" title="">
                            <i className="ti-settings"></i> account setting
                          </a>
                        </li>
                        <li>
                          <a onClick={() => logout()} title="">
                            <i className="ti-power-off"></i> log out
                          </a>
                        </li>
                      </ul>
                    </div>
                  </Dropdown>
                </>
              ) : (
                <>
                  <Dropdown
                    title={
                      <span
                        className="btn"
                        style={{ color: "white", background: "#3ca9fc" }}
                      >
                        {/* <span>Login / signup </span> */}
                        <span

                          title="Village square"
                          data-toggle="tooltip"
                          data-placement="right"
                        >
                          <i className="fa-sharp fa-solid fa-user"></i>
                        </span>
                      </span>
                    }
                  >
                    <div className="user-setting">
                      <ul className="log-out">
                        <li>
                          <Link to={"/auth/signin"} title="">
                            Login
                          </Link>
                        </li>
                        <li>
                          <Link to={"/auth/signup"} title="">
                            Signup
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </Dropdown>
                </>
              )}
            </div>
            <span className="main-menu" data-ripple=""></span>
          </div>
        </div>
      </div>
      <section className="layout_padding"></section>
    </>
  );
}

export default Header;
