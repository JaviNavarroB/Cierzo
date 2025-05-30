// hooks/useSport.ts
import { useState, useEffect } from "react";
import SERVER_URL from "../constants/Server";
export interface SportData {

  id: number;
    nombre: string;
    nombre_deporte_abv: string; // abreviatura_deporte
  descripcion: string;                     // mensaje_bienvenida
  diasEntrenamiento: string[];             // parsed JSON
  horario: Array<{ dia: string; hora?: string }>;
  pabellon_nombre: string;
  pabellon_direccion: string;
  pabellon_descripcion: string;
  cuota_mensual: number;
  cuota_anual_federacion: number;
  cta_titulo: string;
  cta_texto: string;
  creado_en: string;
  latitud?: number;                        // if your model includes it
    longitud?: number;
    foto?: string;  // if your model includes it
}


export function useSport(id: number) {
  const [sport, setSport] = useState<SportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 1) bail‐out case
    if (!id) {
      setLoading(false);
      return;
    }

    // 2) do the fetch
    async function fetchSport() {
      try {
        const res = await fetch(`${SERVER_URL}/equipos/${id}`);  // <-- correct URL
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const { equipo } = await res.json();
        setSport(equipo);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);  // ← ALWAYS clear loading
      }
    }

    fetchSport();
  }, [id]);

  return { sport, loading, error };
}
