// models/usuario.model.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/sequelise';
import pool from '../database/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/* ---------- 1. Interface de atributos ---------- */
export interface UsuarioAttributes {
  id: number;
  idRol: number;
  nombre: string;
  apellidos?: string;
  genero: 'Hombre' | 'Mujer' | 'Otro';
  correo: string;
  telefono?: string;
  contrasenya: string;
    foto?: string;
    rol?: string;
}

/* ---------- 2. Atributos opcionales para create() ---------- */
type UsuarioCreation = Optional<
  UsuarioAttributes,
  'id' | 'apellidos' | 'telefono' | 'foto'
>;

/* ---------- 3. Tipo plano para devolver usuarios RAW ---------- */
export type UsuarioPlano = UsuarioAttributes & { rol: string };

/* ---------- 4. Mapeo de roles ---------- */
export function mapIdRolToNombre(idRol: number): string {
  switch (idRol) {
    case 1: return "invitado";
    case 2: return "socio";
    case 3: return "jugador";
    case 4: return "entrenador";
    case 5: return "administrador";
    default: return "invitado";
  }
}

/* ---------- 5. Clase Sequelize ---------- */
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
    public rol?: string;

  /* --------- Métodos estáticos RAW (pool) --------- */

  /** Crea usuario y devuelve el ID generado */
  static async createUsuario(u: Partial<Usuario>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO usuarios (id_rol, nombre, correo, contrasenya)
       VALUES (?, ?, ?, ?)`,
      [
        u.idRol ?? 1,   // Invitado por defecto
        u.nombre,
        u.correo,
        u.contrasenya
      ]
    );
    return result.insertId;
  }

  /** Busca usuario por correo y añade el nombre del rol */
  static async getUsuarioByCorreo(correo: string): Promise<UsuarioPlano | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM usuarios WHERE correo = ?',
      [correo]
    );
    if (!rows.length) return null;
    const user = rows[0] as UsuarioAttributes;
    return { ...user, rol: mapIdRolToNombre(user.idRol) };
  }

  /** Busca usuario por id y añade el nombre del rol */
  static async getUsuarioById(id: number): Promise<UsuarioPlano | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM usuarios WHERE id = ?',
      [id]
    );
    if (!rows.length) return null;
    const user = rows[0] as UsuarioAttributes;
    return { ...user, rol: mapIdRolToNombre(user.idRol) };
  }

 /** Actualiza el perfil completo (nombre, apellidos, correo, foto, contraseña) */
static async updateProfile(
    userId: number,
    updates: {
      nombre?: string;
      apellidos?: string;
      correo?: string;
      foto?: string;
        contrasenya?: string; // Hashed
      genero?: 'Hombre' | 'Mujer' | 'Otro';
        telefono?: string;
        idRol?: number;
    }
  ): Promise<UsuarioPlano> {
    // Construye dinámicamente la consulta SQL sólo con los campos enviados
    const fields = [];
    const values = [];
  
    if (updates.nombre !== undefined) {
      fields.push("nombre = ?");
      values.push(updates.nombre);
    }
    if (updates.apellidos !== undefined) {
      fields.push("apellidos = ?");
      values.push(updates.apellidos);
    }
    if (updates.correo !== undefined) {
      // Validación básica de correo
      const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correoRegex.test(updates.correo)) {
        throw new Error("Correo no válido");
      }
      fields.push("correo = ?");
      values.push(updates.correo);
    }
    if (updates.foto !== undefined) {
      fields.push("foto = ?");
      values.push(updates.foto);
    }
    if (updates.contrasenya !== undefined) {
      // Asume que ya está hasheada
      fields.push("contrasenya = ?");
      values.push(updates.contrasenya);
    }
    if (updates.genero !== undefined) {
        // Asume que ya está hasheada
        fields.push("genero = ?");
        values.push(updates.genero);
    }
    if (updates.telefono !== undefined) {
      fields.push("telefono = ?");
        values.push(updates.telefono);
    }
    if (updates.idRol !== undefined) {
      fields.push("id_rol = ?");
      values.push(updates.idRol);
    }
  
    if (!fields.length) throw new Error("No se enviaron campos para actualizar");
  
    values.push(userId);
  
    await pool.query(
      `UPDATE usuarios SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM usuarios WHERE id = ?',
      [userId]
    );
    if (!rows.length) throw new Error('User not found');
    const user = rows[0] as UsuarioAttributes;
    return { ...user, rol: mapIdRolToNombre(user.idRol) };
  }
}

/* ---------- 6. Init Sequelize Model ---------- */
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
    rol:
    {
      type: DataTypes.STRING, allowNull: false,
      field: 'rol'
        },
    },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: false
    }
);

export default Usuario;
