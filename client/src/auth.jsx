import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

   useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setUser({ id: decoded.sub, role: decoded.role });
        setToken(storedToken);
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post('/auth/login', { email, password });
    // setUser(data.user);
    // setToken(data.token);
    // localStorage.setItem('auth', JSON.stringify({ user: data.user, token: data.token }));
    localStorage.setItem('token', data.token);
    const decoded = jwtDecode(data.token);
    setUser({ id: decoded.sub, role: decoded.role });
    setToken(data.token);
  };

  const signup = async (name, email, password, role = 'team_member') => {
    const { data } = await axios.post('/auth/signup', { name, email, password, role });
    localStorage.setItem('token', data.token);
    const decoded = jwtDecode(data.token);
    setUser({ id: decoded.sub, role: decoded.role });
    setToken(data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = useMemo(() => ({ user, token, login, signup, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function Protected({ roles, children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }
  
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <button 
            onClick={() => navigate(-1)}  // <-- Go back to previous page
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}


