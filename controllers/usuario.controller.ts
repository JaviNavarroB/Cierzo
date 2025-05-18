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
  public async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = req.user?.id;
      if (!currentUserId) {
        res.status(401).json({ message: 'Usuario no autenticado' });
        return;
      }

      const { Foto} = req.body;
      const updated = await Usuario.updateProfile(currentUserId, {
        foto: Foto,
      });

      const authHeader = req.headers.authorization;
      const token = authHeader ? authHeader.split(' ')[1] : '';

      res.json({ message: 'Perfil actualizado', user: { ...updated, token } });
    } catch (err) {
      console.error('updateProfile:', err);
      res.status(500).json({ message: 'Error actualizando perfil' });
    }
  }
}
