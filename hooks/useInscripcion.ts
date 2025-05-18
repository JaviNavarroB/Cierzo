//hooks/useInscripcion.ts
import { useState } from 'react';
import SERVER_URL from '../constants/Server';
import { useAuthExported } from '../contexts/AuthContext';

export const useInscripcion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const { token }               = useAuthExported();

  const inscribirseEnEvento = async (eventId: number, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${SERVER_URL}/inscripcionEvento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al inscribir');
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { inscribirseEnEvento, loading, error };
};
