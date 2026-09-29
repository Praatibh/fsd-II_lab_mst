import { createContext, useContext, useEffect, useState } from "react";
import { DEMO_USERS, createToken, verifyToken } from "./jwt.js";

const TOKEN_KEY = "auth_token";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // decoded payload
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Restore session on page load: verify the stored token
  useEffect(() => {
    (async () => {
      const saved = localStorage.getItem(TOKEN_KEY);
      const payload = saved ? await verifyToken(saved) : null;
      if (payload) {
        setToken(saved);
        setUser(payload);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
      setLoading(false);
    })();
  }, []);

  async function login(username, password) {
    setError("");
    const found = DEMO_USERS.find((u) => u.username === username && u.password === password);
    if (!found) {
      setError("Invalid username or password. Check both and try again.");
      return false;
    }
    const newToken = await createToken(found);   // token generation
    localStorage.setItem(TOKEN_KEY, newToken);   // token storage
    setToken(newToken);
    setUser(await verifyToken(newToken));
    return true;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, error, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
