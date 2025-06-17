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
// import { VillageProvider } from "./component/villageSqare/VillageContext/index.jsx";
// import { EventProvider } from "./component/Events/EventContext/index.jsx";
// import { PostProvider } from "./component/posts/PostContext/index.jsx";
// import { CommentProvider } from "./component/Comments/commentContext.jsx";

// Wrapper component to provide the `user` object
const RootWrapper = () => {
  const { user } = useAuth();
  // console.log(user);
  return (
    <PostProvider user={user}>
      {/* //   <EventProvider user={user}>
    //     <PostProvider user={user}>
    //       <CommentProvider user={user}> */}
      <App />
      {/* //       </CommentProvider> */}
      {/* //     </PostProvider> */}
      {/* //   </EventProvider> */}
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
