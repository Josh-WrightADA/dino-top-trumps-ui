import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

function isTokenExpired(decoded) {
  if (!decoded || !decoded.exp) return true;
  // exp is in seconds; Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now();
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      if (decoded && !isTokenExpired(decoded)) {
        setToken(storedToken);
        setUser({ id: decoded.sub || decoded.id, username: decoded.username || decoded.sub });
      } else {
        localStorage.removeItem('token');
      }
    }
  }, []);

  function login(newToken) {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const decoded = decodeToken(newToken);
    if (decoded) {
      setUser({ id: decoded.sub || decoded.id, username: decoded.username || decoded.sub });
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
