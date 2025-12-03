// pages/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { api, authHeaders } from "../../../lib/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /** persist helpers */
  const persist = (u, t) => {
    if (u) localStorage.setItem("userdata", JSON.stringify(u));
    if (t) localStorage.setItem("token", t);
  };

  useEffect(() => {
    const u = localStorage.getItem("userdata");
    const t = localStorage.getItem("token");
    if (u && t) {
      setUser(JSON.parse(u));
      setToken(t);
    }
    setIsLoading(false);
  }, []);

  /** Login (full replace) */
  const login = ({ user: u, token: t }) => {
    setUser(u);
    setToken(t);
    persist(u, t);
  };

  const refreshUser = async () => {
    if (!token) return;

    try {
      const res = await api.get("/api/v1/profile", authHeaders(token));

      // Adjust this depending on how your backend wraps it
      const payload = res?.data?.data || res?.data || {};
      const freshUser = payload.user || payload;

      setUser(freshUser);
      localStorage.setItem("userdata", JSON.stringify(freshUser));
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  };

  /** Update only token and/or user (used after password change, profile edits, etc.) */
  const setAuth = ({ user: u, token: t }) => {
    if (typeof t !== "undefined") {
      setToken(t);
      if (t) localStorage.setItem("token", t);
      else localStorage.removeItem("token");
    }
    if (typeof u !== "undefined") {
      setUser(u);
      if (u) localStorage.setItem("userdata", JSON.stringify(u));
      else localStorage.removeItem("userdata");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userdata");
    localStorage.removeItem("token");
  };

  /** BUGFIX: this should be true when we HAVE a token/user */
  const isAuthenticated = !!token; // or !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setAuth,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
