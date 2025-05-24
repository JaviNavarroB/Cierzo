// routes/usuario.route.ts
import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { authenticateToken } from '../src/middleware/auth.middleware'; // Updated import


const router = Router();
const usuarioControllerInstance = new UsuarioController();

router.post('/register', usuarioControllerInstance.registerUser);
router.post('/login', usuarioControllerInstance.loginUser);

router.put('/profile', authenticateToken, usuarioControllerInstance.updateProfile.bind(usuarioControllerInstance));
router.get('/profile', authenticateToken, usuarioControllerInstance.getProfile.bind(usuarioControllerInstance));



export default router;
