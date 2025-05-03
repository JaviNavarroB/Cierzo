// models/equipo.model.ts
import pool from '../database/database';
import { RowDataPacket } from 'mysql2';

interface EquipoRow extends RowDataPacket {
  id: number;
  nombre: string;
  id_deporte: number;
  nombre_deporte_abv: string;
  mensaje_bienvenida: string;
  dias_entrenamiento: string;
  horario: string;
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
  avatar_url?: string | null;
}

class Equipo {
  static async getAllEquipos() {
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

  static async getEquipoById(id: number) {
    const sql = `
      SELECT e.*, d.cuota_mensual, d.cuota_anual_federacion
      FROM equipos e
      JOIN Deporte d ON e.id_deporte = d.id
      WHERE e.id = ?
    `;
    const [rows] = await pool.query<EquipoRow[]>(sql, [id]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      nombre: r.nombre,
      descripcion: r.mensaje_bienvenida,
      diasEntrenamiento: JSON.parse(r.dias_entrenamiento),
      horario: JSON.parse(r.horario),
      pabellon_nombre: r.pabellon_nombre,
      pabellon_direccion: r.pabellon_direccion,
      pabellon_descripcion: r.pabellon_descripcion,
      cta_titulo: r.cta_titulo,
      cta_texto: r.cta_texto,
      cuota_mensual: r.cuota_mensual,
      cuota_anual_federacion: r.cuota_anual_federacion,
      creado_en: r.creado_en.toISOString(),
    };
  }

  static async getInscripcionesConUsuario(teamId: number) {
    const sql = `
      SELECT ie.id_usuario, u.nombre, u.avatar_url
      FROM inscripcion_equipo ie
      JOIN Usuarios u ON ie.id_usuario = u.id
      WHERE ie.id_equipo = ?
    `;
    const [rows] = await pool.query<InscRow[]>(sql, [teamId]);
    return rows.map(r => ({
      id_usuario: r.id_usuario,
      nombre: r.nombre,
      avatar_url: r.avatar_url ?? null,
    }));
  }
}

export default Equipo;
