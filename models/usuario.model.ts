// models/usuario.model.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/sequelise';
import pool from '../database/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/* ---------- 1. Interface de atributos ---------- */
interface UsuarioAttributes {
  id: number;
  idRol: number;
  nombre: string;
  apellidos?: string;
  genero: 'Hombre' | 'Mujer' | 'Otro';
  correo: string;
  telefono?: string;
  contrasenya: string;
  foto?: string;
  descripcion?: string;
}

/* ---------- 2. Atributos opcionales para create() ---------- */
type UsuarioCreation = Optional<
  UsuarioAttributes,
  'id' | 'apellidos' | 'telefono' | 'foto' | 'descripcion'
>;

/* ---------- 3. Clase Sequelize ---------- */
class Usuario extends Model<UsuarioAttributes, UsuarioCreation>
  implements UsuarioAttributes
{
  public id!: number;
  public idRol!: number;
  public nombre!: string;
  public apellidos?: string;
  public genero!: 'Hombre' | 'Mujer' | 'Otro';
  public correo!: string;
  public telefono?: string;
  public contrasenya!: string;
  public foto?: string;
  public descripcion?: string;

  /* --------- Métodos estáticos RAW (pool) --------- */

  /** Crea usuario y devuelve el ID generado */
  static async createUsuario(u: Partial<Usuario>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO usuarios
       (id_rol, nombre, apellidos, genero, correo, telefono, contrasenya, foto, descripcion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        u.idRol ?? 1,                  // invitado por defecto
        u.nombre,
        u.apellidos ?? null,
        u.genero,
        u.correo,
        u.telefono ?? null,
        u.contrasenya,
        u.foto ?? null,
        u.descripcion ?? null
      ]
    );
    return result.insertId;
  }

  /** Busca usuario por correo */
  static async getUsuarioByCorreo(correo: string): Promise<Usuario | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM usuarios WHERE correo = ?',
      [correo]
    );
    return rows.length ? (rows[0] as Usuario) : null;
  }

  /** Actualiza foto y descripción */
  static async updateProfile(
    userId: number,
    updates: { foto?: string; descripcion?: string }
  ): Promise<Usuario> {
    await pool.query(
      'UPDATE usuarios SET foto = ?, descripcion = ? WHERE id = ?',
      [updates.foto ?? null, updates.descripcion ?? null, userId]
    );
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, nombre, correo, foto, descripcion FROM usuarios WHERE id = ?',
      [userId]
    );
    if (!rows.length) throw new Error('User not found');
    return rows[0] as Usuario;
  }
}

/* ---------- 4. Init Sequelize Model ---------- */
Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: 'id'
    },
    idRol: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_rol'
    },
    nombre: { type: DataTypes.STRING(50), allowNull: false, field: 'nombre' },
    apellidos: { type: DataTypes.STRING(50), field: 'apellidos' },
    genero: {
      type: DataTypes.ENUM('Hombre', 'Mujer', 'Otro'),
      allowNull: false,
      field: 'genero'
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'correo'
    },
    telefono: { type: DataTypes.STRING(20), field: 'telefono' },
    contrasenya: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'contrasenya'
    },
    foto: { type: DataTypes.STRING, field: 'foto' },
    descripcion: { type: DataTypes.TEXT, field: 'descripcion' }
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: false
  }
);

export default Usuario;
