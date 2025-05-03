import { Request, Response } from 'express';
import Deporte from '../models/sport.model';

export class DeporteController {
  // GET /api/deportes
  public async getDeportes(req: Request, res: Response): Promise<void> {
    try {
      const deportes = await Deporte.getAllDeportes();
      res.json({ deportes });
    } catch (error) {
      console.error('Error en getDeportes:', error);
      res.status(500).json({ message: 'Error al obtener deportes', deportes: [] });
    }
  }

  // GET /api/deportes/:id
  public async getDeporte(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID inválido', deporte: null });
      return;
    }
    try {
      const deporte = await Deporte.getDeporteById(id);
      if (!deporte) {
        res.status(404).json({ message: 'Deporte no encontrado', deporte: null });
        return;
      }
      res.json({ deporte });
    } catch (error) {
      console.error('Error en getDeporte:', error);
      res.status(500).json({ message: 'Error al obtener deporte', deporte: null });
    }
  }
}
