import { useState } from "react";
import SERVER_URL from "../constants/Server";
import { useAuthExported } from "@/contexts/AuthContext";

export function useInscripcionEquipo() {
  const { token, login } = useAuthExported();
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const inscribir = async (teamId: number, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${SERVER_URL}/inscripcionEquipo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ teamId, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al inscribirse");

      /* refresca AuthContext si el rol cambió a jugador */
      if (data.user) await login(token!, data.user);
      return data;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { inscribir, loading, error };
}
