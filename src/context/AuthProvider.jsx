import { createContext, useContext, useState } from "react";
import { login } from "../services/authService";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = Boolean(token);
  const role = user?.role;

  async function loginUser(credentials) {
    const data = await login(credentials);

    const normalizedUser = {
      ...data.user,
      role: data.user.role,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));

    setToken(data.token);
    setUser(normalizedUser);

    return normalizedUser;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    role,
    isAuthenticated,
    login: loginUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
