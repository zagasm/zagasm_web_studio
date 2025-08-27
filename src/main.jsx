import React from "react";
import { App } from "./app.jsx";
import { render } from "preact";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "preact/compat/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style.css";
import { AuthProvider, useAuth } from "./pages/auth/AuthContext/index.jsx";
import { HelmetProvider } from "react-helmet-async";
import { ModalProvider } from "./component/assets/ModalContext/index.jsx";
const RootWrapper = () => {
  const { user } = useAuth();
  return (
        <App />
    
  );
};
// Render the app
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <HelmetProvider>
        <ModalProvider>
        <RootWrapper />
        </ModalProvider>
      </HelmetProvider>
    </AuthProvider>
  </BrowserRouter>
);
