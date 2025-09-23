import { Fragment, useState, useEffect } from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Enables dropdown and other JS features

import { Routes, Route, useLocation } from "react-router-dom";
import AuthLayout from "./pages/auth/layout";
import { SignUp } from "./pages/auth/signup";
import { Signin } from "./pages/auth/signin";
import { CodeVerification } from "./pages/auth/CodeVerification";
import { ForgetPassword } from "./pages/auth/Forgetpassword";
import { Error404 } from "./pages/errors/pagenotfound";
// import { Onboarding } from "./pages/onboarding";

// import Header from "./component/assets/Header";
import Sidebar from "./component/assets/sidebar/sidebar";
import { Outlet } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { ChangePassword } from "./pages/auth/ChangePassword";
import "react-toastify/dist/ReactToastify.css";
import NetworkStatus from "./component/assets/NetworkStatus";
import Home from "./pages/Home/index.jsx";

import FullpagePreloader from "./component/assets/FullPagePreloader/index.jsx";

import { SigninWithCode } from "./pages/auth/signin/SignCode.jsx";
import { ChangePasswordSuccesffully } from "./pages/auth/ChangePassword/successPasswordChange.jsx";
import Navbar from "./pages/pageAssets/Navbar.jsx";
import PostSignupForm from "./component/assets/ModalContext/signupForm/PostSignUpForm.jsx";
import Sessionpage from "./pages/auth/SessionPage/index.jsx";
import Event from "./pages/event/EventOutlet.jsx";
import ViewEvent from "./pages/event/ViewEvent/index.jsx";
import CreateEvent from "./pages/event/CreateEvent/index.jsx";
import SaveEvents from "./pages/event/SaveEvent/index.jsx";
import AllOrganizers from "./pages/Organizers/index.jsx";
import AccountOutlet from "./pages/Account/AccountOutlet.jsx";
import Account from "./pages/Account/index.jsx";
import AccountInterest from "./pages/Account/interest/index.jsx";
import AccountNotification from "./pages/Account/manageNotification/index.jsx";
import EditProfile from "./pages/Profile/editProfile/index.jsx";
import Profile from "./pages/Profile/index.jsx";
import EditPassword from "./pages/Profile/EditPassword/index.jsx";
import AllNotification from "./pages/Notification/AllNotification/index.jsx";
import Notification from "./pages/Notification/index.jsx";
import EventType from "./pages/event/CreateEvent/event_types.jsx";
import ViewProfile from "./pages/Profile/ViewProfile/index.jsx";

const MainLayout = () => (
  <>
    <PostSignupForm />
    <Navbar />
    <Outlet />
  </>
);
export function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Detects route changes
  const state = location.state;
  if (typeof global === "undefined") {
    window.global = window;
  }
  useEffect(() => {
    setLoading(true); // Show preloader
    const timer = setTimeout(() => setLoading(false), 100); // Simulate load time

    return () => clearTimeout(timer);
  }, [location.pathname]); // Runs on every route change
  const background = location.state?.background;
  return (
    <Fragment>
      {loading && <FullpagePreloader loading={loading} />}

      <ToastContainer />
      <NetworkStatus />
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Signin />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signinwithcode" element={<SigninWithCode />} />
          <Route path="forget-password" element={<ForgetPassword />} />
          <Route path="code-verification" element={<CodeVerification />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="change-password-success" element={<ChangePasswordSuccesffully />} />
          {/*
          {/* <Route path="onboarding" element={<Onboarding />} /> */}
        </Route>
        {/* location={state?.backgroundLocation || location} */}
        <Route element={<Sessionpage />} >
          <Route element={<MainLayout />}>
            <Route index exact path="/" element={<Home />} />
            <Route path="organizers" element={<AllOrganizers />} />
            <Route path="/profile" element={<Profile />} >
              <Route index exact   path=":profileId" element={<ViewProfile />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="edit-password" element={<EditPassword />} />
            </Route>
            <Route path="/event" element={<Event />} >
              <Route path="view/:eventId" element={<ViewEvent />} />
              <Route path="select-event-type" element={<EventType />} />
              <Route path="create-event/:eventType" element={<CreateEvent />} />
              {/* CreateEvent */}
              <Route path="saved-events" element={<SaveEvents />} />
            </Route>
            <Route path="/account" element={<AccountOutlet />} >
              <Route index exact path="/account" element={<Account />} />
              <Route path="interest" element={<AccountInterest />} />
              <Route path="manage-notification" element={<AccountNotification />} />
            </Route>
            <Route path="/notification" element={<Notification />} >
              <Route index exact element={<AllNotification />} />
            </Route>
          </Route>

        </Route>

        <Route path="/page-not-found" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route
            // path="/posts/:postId" 
            element={
              <PostViewModal
                show={true}
                onHide={() => navigate(-1)}
              />
            }
          />
        </Routes>
      )}
    </Fragment>
  );
}
