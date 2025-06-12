import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Initialize as true

  useEffect(() => {
    // Check if the user is already logged in
    const storedUser = localStorage.getItem("userdata");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false); // Set loading to false after checking auth state
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userdata", JSON.stringify(userData));
  };

  const GeSignupData = (userData) => {
    setUser(userData);
    localStorage.setItem("userdata", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userdata");
    localStorage.removeItem("token");
  };
  
  return (
    <AuthContext.Provider value={{ user, isLoading, GeSignupData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);