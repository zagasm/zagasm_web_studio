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
import Navbar from "./pages/pageAssets/Navbar.jsx";
import Chat from "./pages/chatRoom/index.jsx";
import MyProfile from "./pages/Profile/Header.jsx";
import ProfileOutlet from "./pages/Profile/ProfileOutlet.jsx";
import MyMemes from "./pages/Profile/AllMemes.jsx";
import LikesMeme from "./pages/Profile/memesLikes.jsx";
import SavedMeme from "./pages/Profile/savedMemes.jsx";
import Sessionpage from "./pages/auth/SessionPage/index.jsx";
import CreatePost from "./pages/post/createPost/index.jsx";
import PostDetailsPage from "./pages/post/postDetails/index.jsx";
import PostViewModal from "./component/Posts/PostViewMOdal/index.jsx";
import Post from "./component/Posts/PostViewNoModal/index.jsx";


const MainLayout = () => (
  <>
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
      {/* {loading && <FullpagePreloader loading={loading} />} */}

      <ToastContainer />
      <NetworkStatus />
      <Routes>

        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Signin />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="signin" element={<Signin />} />
          <Route path="forget-password" element={<ForgetPassword />} />
          <Route path="code-verification" element={<CodeVerification />} />
          <Route path="change-password" element={<ChangePassword />} />
          {/*
          {/* <Route path="onboarding" element={<Onboarding />} /> */}
        </Route>
        <Route element={<Sessionpage />} location={state?.backgroundLocation || location}>
          <Route element={<MainLayout />}>
            <Route index exact path="/" element={<Home />} />
            <Route path="chat" element={<Chat />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="/posts/:postId" element={<Post />} />
            <Route path="/myprofile" element={<ProfileOutlet />}>
              <Route index element={<MyMemes />} />
              <Route path="mymemes" element={<LikesMeme />} />
              <Route path="savedmemes" element={<SavedMeme />} />

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
