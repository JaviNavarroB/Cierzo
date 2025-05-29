import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../database/database';
import Usuario from '../models/usuario.model';
import { RowDataPacket } from 'mysql2';

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
    
    static async inscribirEnEquipo(req: Request, res: Response): Promise<void> {
        try {
          const userId = req.user?.id;
          if (!userId) {
            res.status(401).json({ error: "No auth" });
            return;
          }
    
          const { teamId, password } = req.body;
          if (!teamId || !password) {
            res.status(400).json({ error: "Faltan datos" });
            return;
          }
    
          /* 1. Verifica contraseña */
          const user = await Usuario.getUsuarioById(userId);
          if (!user) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
          }
          const ok = await bcrypt.compare(password, user.contrasenya);
          if (!ok) {
            res.status(401).json({ error: "Contraseña incorrecta" });
            return;
          }
    
          /* 2. ¿Ya inscrito? */
          const [exists] = await pool.query<RowDataPacket[]>(
            `SELECT 1 FROM inscripcion_equipo
             WHERE id_usuario = ? AND id_equipo = ?
               AND estado_inscripcion = 'Inscrito'`,
            [userId, teamId]
          );
          if (exists.length) {
            res.status(409).json({ error: "Ya inscrito en este equipo" });
            return;
          }
    
          /* 3. Insertar inscripción */
          await pool.query(
            `INSERT INTO inscripcion_equipo
             (id_usuario, id_equipo, fecha_inicio, estado_inscripcion)
             VALUES (?, ?, CURDATE(), 'Inscrito')`,
            [userId, teamId]
          );
    
          /* 4. Cambiar rol a jugador (3) si era 1 o 2 */
          let updated = user;
          if (user.id_rol === 1 || user.id_rol === 2) {
            updated = await Usuario.updateProfile(userId, { id_rol: 3 });
          }
          delete (updated as any).contrasenya;
    
          res.json({ success: true, user: updated });
        } catch (err) {
          console.error("inscribirEnEquipo:", err);
          res.status(500).json({ error: "Error al inscribirse en el equipo" });
        }
      }
    }

