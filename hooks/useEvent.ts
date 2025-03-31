// frontend/src/hooks/useEvent.ts
import { useState, useEffect } from "react";

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
  programa?: any;        // You can later replace "any" with a more specific type if needed
  testimonios?: any;     // e.g., an array of objects with { name, role, text }
  faqs?: any;            // e.g., an array of objects with { question, answer }
  creado_en?: string;
}


export function useEvent(id: number) {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/event/${id}`);
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
    }
    fetchEvent();
  }, [id]);

  return { event, loading, error };
}
