import { createContext, useContext, useEffect, useState } from "react";
import { logoutApi } from "../features/auth/authService";
import { getMyProfileApi } from "../features/profile/profileService"

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const data = await getMyProfileApi();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();

    const handleLogout = () => setUser(null);
    window.addEventListener("auth-logout", handleLogout);

    return () => window.removeEventListener("auth-logout", handleLogout);
  }, []);

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
