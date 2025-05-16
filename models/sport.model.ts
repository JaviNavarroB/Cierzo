// models/deporte.model.ts

import pool from '../database/database';
import { RowDataPacket } from 'mysql2';

interface DeporteRow extends RowDataPacket {
  id: number;
  nombre: string;
  cuota_mensual: number;
  cuota_anual_federacion: number;
}

class Deporte {
  /**
   * Devuelve todos los deportes registrados.
   */
  static async getAllDeportes(): Promise<Array<{
    id: number;
    nombre: string;
    cuota_mensual: number;
    cuota_anual_federacion: number;
  }>> {
    const sql = `
      SELECT
        id,
        nombre,
        cuota_mensual,
        cuota_anual_federacion
      FROM Deporte
    `;
    const [rows] = await pool.query<DeporteRow[]>(sql);
    return rows.map(r => ({
      id: r.id,
      nombre: r.nombre,
      cuota_mensual: Number(r.cuota_mensual),
      cuota_anual_federacion: Number(r.cuota_anual_federacion),
    }));
  }

  /**
   * Devuelve un deporte por su ID, o null si no existe.
   */
  static async getDeporteById(id: number): Promise<{
    id: number;
    nombre: string;
    cuota_mensual: number;
    cuota_anual_federacion: number;
  } | null> {
    const sql = `
      SELECT
        id,
        nombre,
        cuota_mensual,
        cuota_anual_federacion
      FROM deporte
      WHERE id = ?
    `;
    const [rows] = await pool.query<DeporteRow[]>(sql, [id]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      nombre: r.nombre,
      cuota_mensual: r.cuota_mensual,
      cuota_anual_federacion: r.cuota_anual_federacion,
    };
  }
}

export default Deporte;
