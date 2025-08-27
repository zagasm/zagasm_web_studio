import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem("userdata");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData.user);
    setToken(userData.token);
    localStorage.setItem("userdata", JSON.stringify(userData.user));
    localStorage.setItem("token", userData.token); // Optional
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userdata");
    localStorage.removeItem("token");
  };

  const isAuthenticated = !user;
  return (
    <AuthContext.Provider value={{ user,token, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
