import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  userType: 'user' | 'restaurant' | 'admin';
  profile: {
    fullName?: string;
    phone?: string;
    bio?: string;
    gender?: string;
    avatar?: string;
    favoriteCuisine?: string[];
  };
  restaurant?: {
    name?: string;
    type?: string;
    phone?: string;
    address?: string;
    website?: string;
    cuisine?: string[];
    isVerified?: boolean;
    rating?: number;
    reviewCount?: number;
  };
  createdAt?: string;
  updatedAt?: string;
  promotionStatus?: 'none' | 'pending' | 'eligible' | 'approved';
  promotionMessage?: string;
  canCreateRecipe?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  registerRestaurant: (userData: RestaurantRegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  profile: {
    fullName: string;
    phone?: string;
    bio?: string;
    gender?: string,
    avatar?: string
  };
}

interface RestaurantRegisterData {
  username: string;
  email: string;
  password: string;
  profile: {
    fullName: string;
    phone?: string;
    bio?: string;
    gender?: string,
    avatar?: string
  };
  restaurant: {
    name: string;
    type: string;
    phone?: string;
    address?: string;
    website?: string;
    cuisine: string[];
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      console.log('AuthContext - Sending registration data:', userData);
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('AuthContext - Server response:', data);

      if (response.ok) {
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('AuthContext - Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerRestaurant = async (userData: RestaurantRegisterData) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register/restaurant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else {
        throw new Error(data.message || 'Restaurant registration failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      registerRestaurant,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
