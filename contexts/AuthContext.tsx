// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SERVER_URL from "../constants/Server";
import { View } from "react-native";
import { COLORS } from "@/constants/theme";

// Helper para mapear id_rol a string de rol
function mapIdRolToRolString(id_rol: number | string | undefined): string {
  const id = typeof id_rol === "string" ? parseInt(id_rol) : id_rol;
  switch (id) {
    case 1:
      return "invitado";
    case 2:
      return "socio";
    case 3:
      return "jugador";
    case 4:
      return "entrenador";
    case 5:
      return "administrador";
    default:
      return "desconocido";
  }
}
// Helper para mapear id_rol a string

interface AuthContextType {
  token: string | null;
  user: any | null;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Esta función garantiza que el usuario siempre tiene un campo `rol`
  function normalizeUser(userData: any) {
    if (!userData) return userData;
    // ⚠️ Siempre recalcula, sin fiarse de userData.rol
    const rol = mapIdRolToRolString(userData.id_rol ?? userData.id_rol);
    return { ...userData, rol };
  }

  const login = async (newToken: string, userData: any) => {
    try {
      const userWithRol = normalizeUser(userData);
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("user", JSON.stringify(userWithRol));
      setToken(newToken);
      setUser(userWithRol);
      setIsAuthenticated(true);
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

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(normalizeUser(JSON.parse(storedUser)));
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

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider as authProviderExported, useAuth as useAuthExported };
