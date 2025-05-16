// models/equipo.model.ts

import pool from '../database/database';
import { RowDataPacket } from 'mysql2';

interface EquipoRow extends RowDataPacket {
  id: number;
  nombre: string;
  id_deporte: number;
  nombre_deporte_abv: string;
  mensaje_bienvenida: string;
  dias_entrenamiento: any;     // JSON column → JS array/object or string
  horario: any;                // same as above
  pabellon_nombre: string;
  pabellon_direccion: string;
  pabellon_descripcion: string;
  cta_titulo: string;
  cta_texto: string;
  creado_en: Date;
  cuota_mensual: number;
  cuota_anual_federacion: number;
}

interface InscRow extends RowDataPacket {
  id_usuario: number;
    nombre: string;
    foto: string;
}

class Equipo {
  /**
   * Devuelve todos los equipos con su abreviatura de deporte.
   */
  static async getAllEquipos(): Promise<Array<{
    id: number;
    nombre: string;
    nombre_deporte_abv: string;
  }>> {
    const sql = `
      SELECT id, nombre, nombre_deporte_abv
      FROM equipos
    `;
    const [rows] = await pool.query<EquipoRow[]>(sql);
    return rows.map(r => ({
      id: r.id,
      nombre: r.nombre,
      nombre_deporte_abv: r.nombre_deporte_abv,
    }));
  }

  /**
   * Devuelve un equipo por su ID, incluyendo datos JSON y cuotas.
   */
    static async getEquipoById(id: number) {
    const sql = `
      SELECT 
        e.*, 
        CAST(d.cuota_mensual           AS DECIMAL(10,2)) AS cuota_mensual,
        CAST(d.cuota_anual_federacion  AS DECIMAL(10,2)) AS cuota_anual_federacion
      FROM equipos e
      JOIN deporte d ON e.id_deporte = d.id
      WHERE e.id = ?
    `;

    const [rows] = await pool.query<EquipoRow[]>(sql, [id]);
    if (rows.length === 0) return null;
    const r = rows[0];

    // Normalize dias_entrenamiento → string[]
    let diasEntrenamiento: string[] = [];
    const rawDias = r.dias_entrenamiento;
    if (rawDias != null) {
      if (Array.isArray(rawDias)) {
        diasEntrenamiento = rawDias;
      } else if (typeof rawDias === 'string') {
        try {
          diasEntrenamiento = JSON.parse(rawDias);
        } catch {
          diasEntrenamiento = rawDias.split(',');
        }
      }
    }

    // Normalize horario → Array<{ day; time }>
    let horarioArr: Array<{ day: string; time?: string }> = [];
    const rawHorario = r.horario;
    if (rawHorario != null) {
      if (Array.isArray(rawHorario)) {
        horarioArr = rawHorario;
      } else if (typeof rawHorario === 'string') {
        try {
          horarioArr = JSON.parse(rawHorario);
        } catch {
          horarioArr = rawHorario.split(',').map(chunk => {
            const [day, time] = chunk.split(':');
            return { day, time };
          });
        }
      }
    }

    return {
      id: r.id,
        nombre: r.nombre,
      nombre_deporte_abv: r.nombre_deporte_abv,
      descripcion: r.mensaje_bienvenida,
      diasEntrenamiento,
      horario: horarioArr,
      pabellon_nombre: r.pabellon_nombre,
      pabellon_direccion: r.pabellon_direccion,
      pabellon_descripcion: r.pabellon_descripcion,
      cta_titulo: r.cta_titulo,
      cta_texto: r.cta_texto,
      cuota_mensual: Number(r.cuota_mensual),
      cuota_anual_federacion: Number(r.cuota_anual_federacion),
      creado_en: r.creado_en.toISOString(),
    };
  }

  /**
   * Devuelve todas las inscripciones (jugadores) de un equipo,
   * junto con el nombre del usuario.
   */
  static async getInscripcionesConUsuario(teamId: number): Promise<Array<{
    id_usuario: number;
    nombre: string;
  }>> {
    const sql = `
      SELECT ie.id_usuario, u.nombre, u.foto
      FROM inscripcion_equipo ie
      JOIN usuarios u ON ie.id_usuario = u.id
      WHERE ie.id_equipo = ?
    `;
    const [rows] = await pool.query<InscRow[]>(sql, [teamId]);
    return rows.map(r => ({
      id_usuario: r.id_usuario,
        nombre: r.nombre,
        foto: r.foto ? `/players/${r.foto}` : undefined,
    }));
  }
}

export default Equipo;
