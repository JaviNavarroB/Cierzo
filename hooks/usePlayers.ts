// hooks/usePlayers.ts
import { useState, useEffect, useCallback } from "react";
import SERVER_URL from "../constants/Server";

export interface Player {
  id: number | string;
  nombre: string;
  foto?: string;
}

export function usePlayers(teamId: number) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<Error | null>(null);

  /* ----- función reutilizable ----- */
  const fetchPlayers = useCallback(async () => {
    if (!teamId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${SERVER_URL}/equipos/${teamId}/inscripciones`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPlayers(
        data.inscripciones.map((i: any) => ({
          id: i.id_usuario,
          nombre: i.nombre,
          foto: i.foto,
        }))
      );
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  /* carga inicial y cuando cambie teamId */
  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return { players, loading, error, refetch: fetchPlayers };
}
