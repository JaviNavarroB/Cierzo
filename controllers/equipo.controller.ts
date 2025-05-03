// controllers/equipo.controller.ts
import { Request, Response } from 'express';
import Equipo from '../models/equipo.model';

export class EquipoController {
  public async getEquipos(req: Request, res: Response): Promise<void> {
    try {
      const equipos = await Equipo.getAllEquipos();
      res.json({ equipos });
    } catch (error) {
      console.error('Error en getEquipos:', error);
      res.status(500).json({ message: 'Error al obtener equipos', equipos: [] });
    }
  }

  public async getEquipo(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID inválido', equipo: null });
      return;
    }
    try {
      const equipo = await Equipo.getEquipoById(id);
      if (!equipo) {
        res.status(404).json({ message: 'Equipo no encontrado', equipo: null });
        return;
      }
      res.json({ equipo });
    } catch (error) {
      console.error('Error en getEquipo:', error);
      res.status(500).json({ message: 'Error al obtener equipo', equipo: null });
    }
  }

  public async getInscripciones(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ inscripciones: [] });
      return;
    }
    try {
      const inscripciones = await Equipo.getInscripcionesConUsuario(id);
      res.json({ inscripciones });
    } catch (error) {
      console.error('Error en getInscripciones:', error);
      res.status(500).json({ inscripciones: [] });
    }
  }
}
