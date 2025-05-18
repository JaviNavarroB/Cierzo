// frontend/src/hooks/useEvent.ts
import { useState, useEffect, useCallback } from "react";
import SERVER_URL from "../constants/Server";

export interface EventData {
  id: number;
  titulo: string;
  descripcion?: string;
  fecha?: string;
  hora_inicio?: string;
  hora_fin?: string;
  lugar_nombre?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  fecha_limite_inscripcion?: string;
  cupo_total?: number;
  cupo_disponible?: number;
  programa?: any;
  testimonios?: any;
  faqs?: any;
    creado_en?: string;
    roles_admitidos?: string;
    inscritos?: number; // number of registered users
}

export function useEvent(id: number) {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // fetch function wrapped in useCallback for stable reference
  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${SERVER_URL}/events/event/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvent(data.event);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // load on mount and when id changes
  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return { event, loading, error, refetch: fetchEvent };
}
