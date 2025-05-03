// hooks/useSport.ts

import { useState, useEffect } from "react";

export interface SportData {
  id: number;
  nombre: string;
  descripcion: string;               // welcome message
  horario: Array<{ day: string; time?: string }>;
  cuota_mensual: number;
  cuota_anual_federacion: number;
  pabellon_nombre: string;
  pabellon_direccion: string;
  pabellon_descripcion: string;
  cta_titulo: string;
  cta_texto: string;
  creado_en?: string;
}

export function useSport(id: number) {
  const [sport, setSport] = useState<SportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    async function fetchSport() {
      try {
        const res = await fetch(`/api/sports/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { sport } = await res.json();
        setSport(sport);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSport();
  }, [id]);

  return { sport, loading, error };
}
