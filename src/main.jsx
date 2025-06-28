import React from "react";
import { App } from "./app.jsx";
import { render } from "preact";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "preact/compat/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style.css";
import { AuthProvider, useAuth } from "./pages/auth/AuthContext/index.jsx";
import { PostProvider } from "./component/Posts/PostContext/index.jsx";
import { HelmetProvider } from "react-helmet-async";
import { ProfileProvider } from "./pages/Profile/profileContext/index.jsx";
// Wrapper component to provide the `user` object
const RootWrapper = () => {
  const { user } = useAuth();
  // console.log(user);
  return (
    <PostProvider user={user}>
      <ProfileProvider user={user}>
        <App />
      </ProfileProvider>
    </PostProvider>
  );
};
// Render the app
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <HelmetProvider>
        <RootWrapper />
      </HelmetProvider>
    </AuthProvider>
  </BrowserRouter>
);
