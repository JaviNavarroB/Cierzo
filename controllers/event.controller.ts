// backend/src/controllers/event.controller.ts

import { Request, Response } from 'express';
import Event from '../models/event.model';

export class EventController {
  constructor() {
    console.log('EventController inicializado');
  }

  public async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await Event.getAvailableEvents();

      // Always return an array under "events" property
      res.json({ events });
    } catch (error) {
      console.error('Error in getEvents:', error);
      // Even on error, unify your response shape
      res.status(500).json({ message: 'Error al obtener eventos', events: [] });
    }
  }

  public async getEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const eventId = parseInt(id, 10);
      if (isNaN(eventId)) {
        res.status(400).json({ message: 'ID inválido', event: null });
        return;
      }

      const event = await Event.getEventById(eventId);
      if (!event) {
        res.status(404).json({ message: 'Evento no encontrado', event: null });
        return;
      }

      // Return a single event
      res.json({ event });
    } catch (error) {
      console.error('Error in getEvent:', error);
      res.status(500).json({ message: 'Error al obtener evento', event: null });
    }
  }
}
