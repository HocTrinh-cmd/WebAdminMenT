import React, { createContext, useContext, useState, useEffect } from 'react';
import { login } from '../services/api';
import { User } from '../types';
import toast from 'react-hot-toast';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting login process');

      const response = await login({ email, password });
      console.log('Login response:', response);

      const userData = response.data.data;

      if (!userData) {
        throw new Error('Invalid response from server');
      }

      if (userData.role !== 'Admin' && userData.role !== 'SuperAdmin') {
        throw new Error('Tài khoản không được cấp phép');
      }

      setUser(userData);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      toast.success('Đăng nhập thành công');
    } catch (err) {
      let message = 'Login failed';

      // Kiểm tra nếu lỗi là từ Axios và có phản hồi từ server
      if (axios.isAxiosError(err) && err.response) {
        const responseData = err.response.data;
        message = responseData.data || 'Unknown error occurred'; // Lấy thông báo lỗi từ server
      } else if (err instanceof Error) {
        message = err.message;
      }

      console.log('Error during login:', err);
      setError(message);
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
      console.log('Login process finished');
    }
  };


  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};