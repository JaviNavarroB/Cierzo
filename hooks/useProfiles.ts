// src/hooks/useUpdateProfile.ts
import { useEffect, useState } from "react";
import SERVER_URL from "../constants/Server";
import { useAuthExported } from "@/contexts/AuthContext"; // Ajusta el path a tu contexto

export function useUpdateProfile() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updatedUser, setUpdatedUser] = useState<any>(null);
    const { token, login } = useAuthExported();

    // Puede recibir solo los campos que el usuario quiera cambiar
    const updateProfile = async (fields: {
        nombre?: string;
        apellidos?: string;
        correo?: string;
        foto?: string;
        oldPassword?: string;
        newPassword?: string;
        id_rol?: number;
    }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${SERVER_URL}/profile`, {
                method: "PUT", // o "PATCH" según tu ruta
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(fields),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Error actualizando perfil");
            }
            setUpdatedUser(data.user);
            // Actualiza el user en AuthContext si cambia el email/nombre/foto, etc.
            await login(token!, data.user);
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateProfile, loading, error, updatedUser };
}
    export function useLoadProfile() {
        const { token } = useAuthExported();
        const [profile, setProfile] = useState<any>(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
      
        useEffect(() => {
          if (!token) return;
          setLoading(true);
          setError(null);
          fetch(`${SERVER_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then(async (res) => {
              if (!res.ok) throw new Error((await res.json()).error || "Error");
              return res.json();
            })
            .then((data) => setProfile(data.user))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
        }, [token]);
      
        return { profile, setProfile, loading, error };
      }

