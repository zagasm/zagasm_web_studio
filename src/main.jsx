import React from "react";
import { App } from "./app.jsx";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/vendor/icons/feather.css";
import "./assets/css/style.css";
import "./style.css";
import "./styles/tailwind.css";

import { AuthProvider, useAuth } from "./pages/auth/AuthContext/index.jsx";
import { HelmetProvider } from "react-helmet-async";
import { ModalProvider } from "./component/assets/ModalContext/index.jsx";
import { store } from "./store";

// window.onerror = (msg, url, line) => {
//   debugger;
// };
// window.onunhandledrejection = (e) => {
//   debugger;
// };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

const RootWrapper = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")).render(
  <ReduxProvider store={store}>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <ModalProvider>
            <RootWrapper />
          </ModalProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </AuthProvider>
  </ReduxProvider>
);
