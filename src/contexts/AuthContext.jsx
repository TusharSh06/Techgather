import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { mockApi } from '../mockApi';

// Use environment variable for mock API toggle
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Define available roles
export const ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  ATTENDEE: 'attendee',
  VENDOR: 'vendor'
};

const AuthContext = createContext(null);

// Mock users data - replace with actual API calls
const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  },
  {
    id: 3,
    name: 'Event Organizer',
    email: 'organizer@example.com',
    password: 'organizer123',
    role: 'organizer'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const roles = {
    ATTENDEE: 'attendee',
    ORGANIZER: 'organizer',
    VENDOR: 'vendor',
    ADMIN: 'admin'
  };

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      let response;
      if (USE_MOCK_API) {
        response = await mockApi.getProfile(token);
        setUser(response.user);
      } else {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      // Clear any existing tokens
      localStorage.removeItem('token');
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem('token', token);
      setUser(user);

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      let response;
      if (USE_MOCK_API) {
        response = await mockApi.register(userData);
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userData);
        response = response.data;
      }
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred during registration'
      };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      // Mock update - replace with actual API call
      const updatedUser = {
        ...user,
        ...profileData
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      // Mock password update - replace with actual API call
      // In a real app, you would verify the current password
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const updateUserRole = (userId, newRole) => {
    if (!user || user.role !== 'admin') return false;
    
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    return true;
  };

  // Role check functions
  const isAdmin = () => user?.role === ROLES.ADMIN;
  const isOrganizer = () => user?.role === ROLES.ORGANIZER;
  const isAttendee = () => user?.role === ROLES.ATTENDEE;
  const isVendor = () => user?.role === ROLES.VENDOR;

  // Permission check functions
  const canCreateEvents = () => isAdmin() || isOrganizer();
  const canEditEvents = () => isAdmin() || isOrganizer();
  const canDeleteEvents = () => isAdmin();
  const canJoinEvents = () => isAttendee() || isOrganizer() || isVendor();
  const canViewAnalytics = () => isAdmin() || isOrganizer();
  const canManageVendors = () => isAdmin() || isOrganizer();

  const value = {
    user,
    users,
    roles,
    login,
    logout,
    register,
    loading,
    error,
    updateProfile,
    updatePassword,
    updateUserRole,
    isAdmin,
    isOrganizer,
    isAttendee,
    isVendor,
    canCreateEvents,
    canEditEvents,
    canDeleteEvents,
    canJoinEvents,
    canViewAnalytics,
    canManageVendors
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};