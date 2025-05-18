// hooks/usePlayers.ts

import { useState, useEffect } from "react";
import SERVER_URL from "../constants/Server";

export interface Player {
  id: number | string;
  nombre: string;
  foto?: string;
}

export function usePlayers(teamId: number) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!teamId) return setLoading(false);
    const url = `${SERVER_URL}/equipos/${teamId}/inscripciones`;
    console.log("Fetch de inscripciones:", url);
    fetch(url)
      .then(res => {
        console.log("Status:", res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("INSCRIPCIONES RAW:", data.inscripciones);
        setPlayers(
          data.inscripciones.map((i: any) => ({
            id: i.id_usuario,
            nombre: i.nombre,
            foto: i.foto,
          }))
        );
      })
      .catch(err => {
        console.error(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [teamId]);

  return { players, loading, error };
}