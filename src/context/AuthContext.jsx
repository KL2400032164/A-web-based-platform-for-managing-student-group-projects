import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'spms_user';
const USERS_STORAGE_KEY = 'spms_users';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [registeredUsers, setRegisteredUsers] = useState(getStoredUsers);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return;
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = ({ email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const credentialMap = {
      'admin@gmail.com': 'admin',
      'student@gmail.com': 'student'
    };
    const matchedRole = credentialMap[normalizedEmail];
    const createdAccount = registeredUsers.find((item) => item.email === normalizedEmail);

    if (!password?.trim()) {
      return { success: false, message: 'Password is required.' };
    }

    if (matchedRole) {
      if (role !== matchedRole) {
        return {
          success: false,
          message: `Role mismatch. Select ${matchedRole} for ${normalizedEmail}.`
        };
      }

      const authenticatedUser = {
        email: normalizedEmail,
        role: matchedRole,
        name: matchedRole === 'admin' ? 'Admin User' : 'Student User'
      };

      setUser(authenticatedUser);
      return { success: true, user: authenticatedUser };
    }

    if (!createdAccount) {
      return {
        success: false,
        message: 'Invalid credentials. Create an account first or use admin/student demo login.'
      };
    }

    if (createdAccount.password !== password) {
      return { success: false, message: 'Incorrect password.' };
    }

    if (createdAccount.role !== role) {
      return {
        success: false,
        message: `Role mismatch. Select ${createdAccount.role} for ${normalizedEmail}.`
      };
    }

    const authenticatedUser = {
      name: createdAccount.name,
      email: createdAccount.email,
      role: createdAccount.role
    };

    setUser(authenticatedUser);
    return { success: true, user: authenticatedUser };
  };

  const signup = ({ name, email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const emailExistsInDemo = normalizedEmail === 'admin@gmail.com' || normalizedEmail === 'student@gmail.com';
    const emailExistsInCreated = registeredUsers.some((item) => item.email === normalizedEmail);

    if (emailExistsInDemo || emailExistsInCreated) {
      return { success: false, message: 'Account already exists for this email.' };
    }

    if (!password?.trim()) {
      return { success: false, message: 'Password is required.' };
    }

    // Frontend-only registration flow using local context state + localStorage persistence.
    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      password,
      role
    };

    setRegisteredUsers((prev) => [...prev, newUser]);

    const authenticatedUser = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };

    setUser(authenticatedUser);
    return { success: true, user: authenticatedUser };
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
