import React, { createContext, useState, useEffect } from "react";
import { getToken, getUser, logoutService } from "../services/auth";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = await getToken();
      const user = await getUser();
      setIsAuth(!!token);
      setRole(user?.role === "admin" || user?.role === "user" ? user.role : null);
    } catch (e) {
      setIsAuth(false);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Fungsi ini akan dipanggil dari LoginScreen
  const login = (userRole: "admin" | "user") => {
    setIsAuth(true);
    setRole(userRole);
  };

  // Fungsi ini akan dipanggil dari HomeScreen
  const logout = async () => {
    await logoutService();
    setIsAuth(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuth, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};