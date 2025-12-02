import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function AuthLayout() {
  const navigate = useNavigate();
  const { token } = useAuth(); // or whatever your context exposes for auth

  useEffect(() => {
    if (token) {
      navigate("/feed", { replace: true });
    }
  }, [token, navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
