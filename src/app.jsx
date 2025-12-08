import { Fragment, useState, useEffect } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { Routes, Route, useLocation } from "react-router-dom";
import AuthLayout from "./pages/auth/layout";
import { SignUp } from "./pages/auth/signup";
import { Signin } from "./pages/auth/signin";
import { CodeVerification } from "./pages/auth/CodeVerification";
import { ForgetPassword } from "./pages/auth/Forgetpassword";
import { Error404 } from "./pages/errors/pagenotfound";
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
import Landing from "./pages/LandingPage/index.jsx";
import { ToastHost } from "./component/ui/toast.jsx";
import Support from "./pages/support/index.jsx";
import Marketing from "./pages/marketing/index.jsx";
import StreamingPage from "./pages/Streaming/index.jsx";
import DataProtectionPage from "./pages/DataProtection/index.jsx";
import ZagasmLanding from "./pages/LandingPage/index.jsx";
import TicketsPage from "./pages/tickets/TicketsPage.jsx";
import PaymentCallback from "./pages/payment/PaymentCallback.jsx";
import SearchPage from "./pages/Search/index.jsx";
import OrganisersIFollow from "./pages/following/OrganisersIFollow.jsx";
import OrganiserFollowers from "./pages/following/OrgaaniserFollowers.jsx";
import BecomeOrganiser from "./pages/Organizers/BecomeOrganizer.jsx";
import SubscriptionsPage from "./pages/subscription/index.jsx";
import PrivacyPolicyPage from "./pages/privacy/index.jsx";
import CommunityGuidelinesPage from "./pages/communityGuideline/index.jsx";
import TermsOfServicePage from "./pages/terms/index.jsx";
import TaggedMentionsPage from "./pages/mentions/index.jsx";
import LandingLayout from "./layouts/LandingLayout.jsx";
import AboutPage from "./pages/LandingPage/about.jsx";
import ContactPage from "./pages/LandingPage/contact.jsx";
import BlockedUsersPage from "./pages/Account/Blocked/index.jsx";
import CryptoWalletsPage from "./pages/crypto/index.jsx";
import EventEditPage from "./pages/event/EventEditPage.jsx";
import DisableRightClick from "./component/DisableRightClick.jsx";

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

      <ToastHost />
      <ToastContainer />
      <NetworkStatus />
      <DisableRightClick />
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<ZagasmLanding />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route
            path="/community-guidelines"
            element={<CommunityGuidelinesPage />}
          />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/support" element={<Support />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/data-protection" element={<DataProtectionPage />} />
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Signin />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signinwithcode" element={<SigninWithCode />} />
          <Route path="forget-password" element={<ForgetPassword />} />
          <Route path="code-verification" element={<CodeVerification />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route
            path="change-password-success"
            element={<ChangePasswordSuccesffully />}
          />
          {/*
          {/* <Route path="onboarding" element={<Onboarding />} /> */}
        </Route>
        {/* location={state?.backgroundLocation || location} */}
        <Route element={<Sessionpage />}>
          <Route element={<MainLayout />}>
            <Route index exact path="/feed" element={<Home />} />
            <Route path="organizers" element={<AllOrganizers />} />
            <Route path="/become-an-organiser" element={<BecomeOrganiser />} />
            <Route path="/profile" element={<Profile />}>
              <Route index exact path=":profileId" element={<ViewProfile />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="edit-password" element={<EditPassword />} />
            </Route>
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/payment/callback" element={<PaymentCallback />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/mentions" element={<TaggedMentionsPage />} />

            <Route path="/event" element={<Event />}>
              <Route path="view/:eventId" element={<ViewEvent />} />
              <Route path="edit/:eventId" element={<EventEditPage />} />
              <Route path="select-event-type" element={<EventType />} />
              <Route
                path="create-event/:eventTypeId"
                element={<CreateEvent />}
              />
              {/* CreateEvent */}
              <Route path="saved-events" element={<SaveEvents />} />
            </Route>
            <Route path="/creator/channel/new" element={<StreamingPage />} />
            <Route path="/subscription" element={<SubscriptionsPage />} />
            <Route path="/account" element={<AccountOutlet />}>
              <Route index exact path="/account" element={<Account />} />
              <Route path="interest" element={<AccountInterest />} />
              <Route path="blocked" element={<BlockedUsersPage />} />
              <Route path="crypto-wallet" element={<CryptoWalletsPage />} />
              <Route
                path="manage-notification"
                element={<AccountNotification />}
              />
            </Route>
            <Route path="/notifications" element={<Notification />}>
              <Route index exact element={<AllNotification />} />
            </Route>
            <Route path="/me/organisers" element={<Notification />}>
              <Route index exact element={<OrganisersIFollow />} />
              <Route path="followers" element={<OrganiserFollowers />} />
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
            element={<PostViewModal show={true} onHide={() => navigate(-1)} />}
          />
        </Routes>
      )}
    </Fragment>
  );
}
