// frontend/src/hooks/useEvents.ts
import { useState, useEffect } from 'react';
import SERVER_URL from "../constants/Server";

export interface EventType {
  id: number;
  titulo: string;
  descripcion?: string;
  fecha?: string;
  hora_inicio?: string;
  hora_fin?: string;
  lugar_nombre?: string;
  direccion?: string;
    fecha_limite_inscripcion?: string;
    roles_admitidos?: string;
  // ... etc. add more fields as needed
}

export function useEvents() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        // Adjust URL if your server is not on localhost:3000
        const response = await fetch(`${SERVER_URL}/events/events`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // data should look like { events: [...] }
        if (Array.isArray(data.events)) {
          setEvents(data.events);
        } else {
          setEvents([]);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return { events, loading, error };
}
