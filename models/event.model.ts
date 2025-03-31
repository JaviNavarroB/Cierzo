//models/usuario.model.ts
import { Model, DataTypes } from 'sequelize';
import pool from '../database/database';
import { RowDataPacket } from 'mysql2';
import { json } from 'sequelize';

class Event extends Model {
    public id!: number;
    public titulo!: string;
    public descripcion?: string;
    public fecha?: Date;
    public hora_inicio?: Date;
    public hora_fin?: Date;
    public lugar_nombre?: string;
    public direccion?: string;
    public latitud?: number;
    public longitud?: number;
    public fecha_limite_inscripcion?: Date;
    public cupo_total?: number;
    public cupo_disponible?: number;
    public programa?: any;
    public testimonios?: any;
    public faqs?: any;
    public creado_en?: Date;

    

    // Static methods for database operations


    static async getEventById(id: number): Promise<Event | null> {
        const [rows]: any[] = await pool.query("SELECT * FROM Eventos WHERE id = ?", [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async getAvailableEvents(): Promise<any[]> {
        try {
            const [eventos] = await pool.execute<RowDataPacket[]>(`
        SELECT * FROM Eventos `);
    
            return eventos.map(evento => ({
                id: evento.id, // ensure this property is set correctly
                titulo: evento.titulo,
                descripcion: evento.descripcion,
                fecha: evento.fecha,
                hora_inicio: evento.hora_inicio,
                hora_fin: evento.hora_fin,
                lugar_nombre: evento.lugar_nombre,
                direccion: evento.direccion,
                fecha_limite_inscripcion: evento.fecha_limite_inscripcion,
       
            })) || [];
        } catch (error) {
            console.error('Database error in getAvailableEvents:', error);
            throw new Error('Error fetching available events');
        }
    }
}

export default Event;




