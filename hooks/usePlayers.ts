// hooks/usePlayers.ts

import { useState, useEffect } from "react";

export interface Player {
  id: number | string;
  name: string;
  imageUri?: string;
}

export function usePlayers(teamId: number) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!teamId) {
      setLoading(false);
      return;
    }
    async function fetchPlayers() {
      try {
        const res = await fetch(`/api/sports/${teamId}/inscripciones`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { inscripciones }: { inscripciones: Array<{
          id_usuario: number;
          nombre: string;
          avatar_url?: string;
        }> } = await res.json();

        setPlayers(
          inscripciones.map(i => ({
            id: i.id_usuario,
            name: i.nombre,
            imageUri: i.avatar_url,
          }))
        );
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, [teamId]);

  return { players, loading, error };
}
