// hooks/useEquipos.ts

import { useState, useEffect } from "react";

export interface EquipoItem {
  id: number;
  nombre: string;               // team name
  nombre_deporte_abv: string;   // sport name or abbreviation
}

export function useEquipos() {
  const [equipos, setEquipos] = useState<EquipoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEquipos() {
      try {
        const res = await fetch("/api/equipos");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { equipos: data } = await res.json() as { equipos: EquipoItem[] };
        setEquipos(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEquipos();
  }, []);

  return { equipos, loading, error };
}
