import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, signup as signupAPI, updateProfile as updateProfileAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser && savedUser !== 'undefined') {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    const { data } = await loginAPI({ email, password });
    const { token, ...userData } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
    return data;
  };

  const signupUser = async (name, email, password, address) => {
    const { data } = await signupAPI({ name, email, password, address });
    const { token, ...userData } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (address) => {
    const { data } = await updateProfileAPI({ address });
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login: loginUser, signup: signupUser, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
