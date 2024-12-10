import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  refreshUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
          setUser({
            token,
            refreshToken,
            ...JSON.parse(storedUser),
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const refreshUser = async () => {
    try {
      const response = await api.get("/users/me");
      if (response.data) {
        const updatedUser = {
          ...user,
          ...response.data,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(response.data));
        return updatedUser;
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      throw error;
    }
  };

  const login = (authData) => {
    const userData = {
      token: authData.data.accessToken,
      refreshToken: authData.data.refreshToken,
      ...authData.data.user,
    };
    setUser(userData);
    localStorage.setItem("token", authData.data.accessToken);
    localStorage.setItem("refreshToken", authData.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(authData.data.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    refreshUser,
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
