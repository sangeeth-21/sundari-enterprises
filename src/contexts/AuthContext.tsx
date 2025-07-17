
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface UserPermissions {
  id: number;
  user_id: number;
  dashboard: number;
  bills: number;
  brand: number;
  product: number;
  customer: number;
  checkin: number;
  auditlogs: number;
  reports: number;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  permissions: UserPermissions | null;
  token: string | null;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user, permissions, and token from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    const savedPermissions = localStorage.getItem('auth_permissions');
    const savedToken = localStorage.getItem('auth_token');
    
    if (savedUser && savedPermissions && savedToken) {
      setUser(JSON.parse(savedUser));
      setPermissions(JSON.parse(savedPermissions));
      setToken(savedToken);
    }
  }, []);

  const login = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.specd.in/sundarienterprises/index.php/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();
      console.log('Login API Response:', data);

      if (data.success && data.data) {
        const { user: userData, permissions: permissionsData } = data.data;
        
        // Use user ID as token since no token is provided by the API
        const userToken = userData.id.toString();
        
        // Save user, permissions, and token data
        setUser(userData);
        setPermissions(permissionsData);
        setToken(userToken);
        
        // Persist to localStorage
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('auth_permissions', JSON.stringify(permissionsData));
        localStorage.setItem('auth_token', userToken);
        
        console.log('Login successful, user ID as token:', userToken);
        setIsLoading(false);
        return true;
      }
      
      console.error('Login failed:', data);
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setPermissions(null);
    setToken(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_permissions');
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, permissions, token, login, logout, isLoading }}>
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
