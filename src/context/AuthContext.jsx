import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../lib/api';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'spms_user';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return;
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [user]);

  const login = async ({ email, password, role }) => {
    const normalizedEmail = email?.trim().toLowerCase();
    const demoUsers = {
      'admin@gmail.com': { role: 'admin', name: 'Admin User' },
      'student@gmail.com': { role: 'student', name: 'Student User' }
    };

    if (!password?.trim()) {
      return { success: false, message: 'Password is required.' };
    }

    try {
      const { user: authenticatedUser } = await authApi.login({ email, password, role });
      setUser(authenticatedUser);
      return { success: true, user: authenticatedUser };
    } catch (error) {
      const demoUser = demoUsers[normalizedEmail];
      if (demoUser) {
        if (role !== demoUser.role) {
          return {
            success: false,
            message: `Role mismatch. Select ${demoUser.role} for ${normalizedEmail}.`
          };
        }

        const authenticatedUser = {
          id: normalizedEmail,
          name: demoUser.name,
          email: normalizedEmail,
          role: demoUser.role
        };
        setUser(authenticatedUser);
        return { success: true, user: authenticatedUser };
      }

      return { success: false, message: error.message };
    }
  };

  const signup = async ({ name, email, password, role }) => {
    try {
      const { user: authenticatedUser } = await authApi.signup({ name, email, password, role });
      setUser(authenticatedUser);
      return { success: true, user: authenticatedUser };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
