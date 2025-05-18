import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../database/database';
import Usuario from '../models/usuario.model';

export class InscripcionController {
  /** POST /inscripcion */
  public static async inscribirEnEvento(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const { eventId, password } = req.body;
      if (!eventId || !password) {
        res.status(400).json({ error: 'Faltan datos' });
        return;
      }

      // 1) Traer el usuario y comparar contraseña
      const user = await Usuario.getUsuarioById(userId);
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      const match = await bcrypt.compare(password, user.contrasenya);
      if (!match) {
        res.status(401).json({ error: 'Contraseña incorrecta' });
        return;
      }

      // 2) Traer datos del evento (fecha y cupo)
      const [eventRows]: any[] = await pool.query("SELECT fecha, cupo_total FROM Eventos WHERE id = ?", [eventId]);
      if (!eventRows.length) {
        res.status(404).json({ error: 'Evento no encontrado' });
        return;
      }
      const event = eventRows[0];

      // 3) Comprobar si el evento ya ha pasado
      const now = new Date();
      const eventDate = new Date(event.fecha);
      if (eventDate < now) {
        res.status(400).json({ error: 'No puedes inscribirte a un evento pasado' });
        return;
      }

      // 4) Comprobar si el cupo ya está lleno
      const [inscRows]: any[] = await pool.query(
        'SELECT COUNT(*) AS inscritos FROM inscripcion_evento WHERE id_evento = ? AND estado_inscripcion = "Inscrito"',
        [eventId]
      );
      const inscritos = inscRows[0].inscritos || 0;
      if (inscritos >= event.cupo_total) {
        res.status(400).json({ error: 'El evento ya ha alcanzado el cupo máximo' });
        return;
      }

      // 5) Comprobar si ya está inscrito
      const [existsRows]: any[] = await pool.query(
        'SELECT * FROM inscripcion_evento WHERE id_usuario = ? AND id_evento = ? AND estado_inscripcion = "Inscrito"',
        [userId, eventId]
      );
      if (existsRows.length > 0) {
        res.status(409).json({ error: 'Ya estás inscrito en este evento' });
        return;
      }

      // 6) Insertar la inscripción
      await pool.query(
        'INSERT INTO inscripcion_evento (id_usuario, id_evento, fecha_inscripcion, estado_inscripcion) VALUES (?, ?, NOW(), "Inscrito")',
        [userId, eventId]
      );

      res.json({ success: true });
    } catch (err) {
      console.error('inscribirEnEvento:', err);
      res.status(500).json({ error: 'Error al inscribir en el evento' });
    }
  }
}
