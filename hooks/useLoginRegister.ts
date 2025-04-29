import { useState } from 'react';
import SERVER_URL from '../constants/Server';
import { useAuthExported } from '../contexts/AuthContext';

export const useLoginRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const { login } = useAuthExported();

  /* ------------ LOGIN ------------ */
  const loginUser = async (credentials: {
    Correo: string;
    Contrasenya: string;          // <- nombre correcto
  }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${SERVER_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en el login');

      await login(data.token, data.user);   // guarda en contexto
      return data;
    } catch (err: any) {
      setError(err.message || 'Error desconocido en el login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ------------ REGISTRO ------------ */
  const registerUser = async (userData: {
    Nombre: string;
    Correo: string;
    Contrasenya: string;
    Foto?: string;
    Descripcion?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const res  = await fetch(`${SERVER_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en el registro');

      return data;                 // { userId: ... }
    } catch (err: any) {
      setError(err.message || 'Error desconocido en el registro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, registerUser, loading, error };
};
