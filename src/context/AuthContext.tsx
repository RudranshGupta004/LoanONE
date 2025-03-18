
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define user types
interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

// Define auth context shape
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For this demo, we'll simulate a successful login after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email and password are valid (mock validation)
      if (email && password) {
        const mockUser = {
          id: "user-" + Date.now().toString(),
          email: email,
          name: "Demo User",
        };
        
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        toast.success("Successfully logged in!");
        setIsLoading(false);
        return true;
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to log in. Please check your credentials.");
      setIsLoading(false);
      return false;
    }
  };

  // Signup function
  const signup = async (
    email: string, 
    password: string, 
    name?: string, 
    phone?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: "user-" + Date.now().toString(),
        email,
        name,
        phone
      };
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      toast.success("Account created successfully!");
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("You have been logged out");
    navigate("/");
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("If an account exists with this email, password reset instructions have been sent.");
      return true;
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Failed to send password reset email. Please try again.");
      return false;
    }
  };

  // Provide the auth context
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        forgotPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
