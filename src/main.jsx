import React from "react";
import { App } from "./app.jsx";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/vendor/icons/feather.css";
import "./assets/css/style.css";
import "./style.css";
import "./styles/tailwind.css";

import { AuthProvider, useAuth } from "./pages/auth/AuthContext/index.jsx";
import { HelmetProvider } from "react-helmet-async";
import { ModalProvider } from "./component/assets/ModalContext/index.jsx";

// window.onerror = (msg, url, line) => {
//   debugger;
// };
// window.onunhandledrejection = (e) => {
//   debugger;
// };

const RootWrapper = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <HelmetProvider>
      <ModalProvider>
        <RootWrapper />
      </ModalProvider>
    </HelmetProvider>
  </AuthProvider>
);
