// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SERVER_URL from "../constants/Server";
import { View } from "react-native";
import { COLORS } from "@/constants/theme";

interface AuthContextType {
  token: string | null;
  user: any | null;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Create context with proper typing
const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

// Separate Provider component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (newToken: string, userData: any) => {
    try {
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true); // Now this setter exists
    } catch (error) {
      console.error("Error saving auth data:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error removing auth data:", error);
    }
  };

  // Opcional: cargar el token desde AsyncStorage al iniciar la app
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    console.log("AuthContext updated: token", token);
  }, [token]);

  useEffect(() => {
    console.log("AuthContext updated: user", user);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      <View key={token} style={{ flex: 1 }}>
        {children}
      </View>
    </AuthContext.Provider>
  );
};

// Hook for using auth context
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider as authProviderExported, useAuth as useAuthExported };
