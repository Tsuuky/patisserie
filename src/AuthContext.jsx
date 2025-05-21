import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(Cookies.get('auth_token') || null);

  useEffect(() => {
    // met le header Authorization par défaut si token dispo
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      Cookies.set('auth_token', token, { sameSite: 'lax' });
    } else {
      delete axios.defaults.headers.common['Authorization'];
      Cookies.remove('auth_token');
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post('http://localhost:3001/login', { username, password }, { withCredentials: true });
    setToken(res.data.token);
  };

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
