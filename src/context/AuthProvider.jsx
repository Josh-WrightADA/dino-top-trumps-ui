import { useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { getProfile } from '../api/authApi';

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
  return decoded.exp * 1000 < Date.now();
}

function getInitialAuth() {
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
    const decoded = decodeToken(storedToken);
    if (decoded && !isTokenExpired(decoded)) {
      return {
        token: storedToken,
        user: {
          id: decoded.sub || decoded.id,
          username: decoded.username || decoded.sub,
          role: decoded.role || null,
        },
      };
    }
    localStorage.removeItem('token');
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }) {
  const initial = getInitialAuth();
  const [token, setToken] = useState(initial.token);
  const [user, setUser] = useState(initial.user);

  const fetchAndSetProfile = useCallback(async (authToken) => {
    const decoded = decodeToken(authToken);
    if (!decoded) return;
    try {
      const res = await getProfile();
      setUser({
        id: decoded.sub || decoded.id,
        username: decoded.username || decoded.sub,
        avatarUrl: res.data.avatarUrl || null,
        displayName: res.data.displayName || null,
        role: res.data.role || decoded.role || null,
      });
    } catch {
      // Profile fetch failed — keep basic user info from token
    }
  }, []);

  function login(newToken) {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const decoded = decodeToken(newToken);
    if (decoded) {
      setUser({ id: decoded.sub || decoded.id, username: decoded.username || decoded.sub, role: decoded.role || null });
      fetchAndSetProfile(newToken);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  function refreshProfile() {
    if (token) {
      fetchAndSetProfile(token);
    }
  }

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
