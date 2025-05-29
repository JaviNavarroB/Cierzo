import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Usuario from '../models/usuario.model';

const JWT_SECRET = process.env.JWT_SECRET || 'miClaveSecreta';

export class UsuarioController {
  /* ------------ REGISTRO ------------ */
  public async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { Nombre, Correo, Contrasenya } = req.body;

      /* Validaciones mínimas */
      if (!Nombre?.trim()) {
        res.status(400).json({ error: 'El nombre es requerido' });
        return;
      }
      if (!Correo?.trim() || !Contrasenya?.trim()) {
        res.status(400).json({ error: 'Correo y contraseña son requeridos' });
        return;
      }

      /* Hash de la contraseña */
      const hashed = await bcrypt.hash(Contrasenya, 10);

      /* Crear usuario directamente con el método del modelo */
      const userId = await Usuario.createUsuario({
        nombre: Nombre,
        correo: Correo,
        contrasenya: hashed,
      });

      res.status(201).json({ userId });
    } catch (err: any) {
      console.error('registerUser:', err);
      res.status(500).json({ error: err.message });
    }
  }

  /* ------------ LOGIN ------------ */
  public async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { Correo, Contrasenya } = req.body;

      const user = await Usuario.getUsuarioByCorreo(Correo);
      if (!user) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }

      const ok = await bcrypt.compare(Contrasenya, user.contrasenya);
      if (!ok) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }

      /* Generar token JWT (1 h) */
      const token = jwt.sign({ id: user.id, correo: user.correo }, JWT_SECRET, {
        expiresIn: '1h'
      });

      /* Ocultamos la contraseña antes de responder */
      (user as any).contrasenya = undefined;
      res.json({ token, user });
    } catch (err) {
      console.error('loginUser:', err);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }


  /* ------------ ACTUALIZAR PERFIL ------------ */
   // Actualizar perfil
   public async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = req.user?.id;
      if (!currentUserId) {
        res.status(401).json({ message: 'Usuario no autenticado' });
        return;
      }

      // Campos del body
      const { nombre, apellidos, correo, foto, oldPassword, newPassword, genero, telefono, id_rol } = req.body;

      const updateFields: any = {};

      // Validar email si quiere cambiarlo
      if (correo) {
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoRegex.test(correo)) {
          res.status(400).json({ error: 'Correo no válido' });
          return;
        }
        // Verifica si el correo está en uso por otro usuario
        const existing = await Usuario.getUsuarioByCorreo(correo);
        if (existing && existing.id !== currentUserId) {
          res.status(400).json({ error: 'Ese correo ya está en uso.' });
          return;
        }
        updateFields.correo = correo;
      }

      if (nombre) updateFields.nombre = nombre;
      if (apellidos !== undefined) updateFields.apellidos = apellidos;
        if (foto !== undefined) updateFields.foto = foto;
if (genero !== undefined) updateFields.genero = genero;
if (telefono !== undefined) updateFields.telefono = telefono;
        if (id_rol !== undefined && id_rol === 2) updateFields.id_rol = 2;
        

      // Si el usuario quiere cambiar la contraseña
      if (newPassword) {
        if (!oldPassword) {
          res.status(400).json({ error: "Debes indicar tu contraseña actual para cambiarla." });
          return;
        }
        // Verifica que la contraseña antigua es correcta
        const user = await Usuario.getUsuarioById(currentUserId);
        if (!user) {
          res.status(404).json({ error: "Usuario no encontrado" });
          return;
        }
        const match = await bcrypt.compare(oldPassword, user.contrasenya);
        if (!match) {
          res.status(401).json({ error: "La contraseña actual es incorrecta" });
          return;
        }
        // Valida la nueva contraseña (longitud mínima 6)
        if (newPassword.length < 6) {
          res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
          return;
        }
        updateFields.contrasenya = await bcrypt.hash(newPassword, 10);
      }

      // Si no hay nada que actualizar
      if (Object.keys(updateFields).length === 0) {
        res.status(400).json({ error: "No se enviaron datos para actualizar" });
        return;
      }

      const updated = await Usuario.updateProfile(currentUserId, updateFields);

      // Si quieres devolver el token nuevo aquí, lo puedes añadir
      res.json({ message: 'Perfil actualizado', user: updated });
    } catch (err) {
      console.error('updateProfile:', err);
      res.status(500).json({ message: 'Error actualizando perfil' });
    }
    }
    public async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const currentUserId = req.user?.id;
            if (!currentUserId) {
                res.status(401).json({ error: "Usuario no autenticado" });
                return;
            }
            const usuario = await Usuario.getUsuarioById(currentUserId);
            if (!usuario) {
                res.status(404).json({ error: "Usuario no encontrado" });
                return;
            }
            // Nunca devuelvas la contraseña
            delete (usuario as any).contrasenya;
            res.json({ user: usuario });
        } catch (err) {
            res.status(500).json({ error: "Error obteniendo perfil" });
        }
    }    
}

