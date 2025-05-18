// routes/inscripcion.routes.ts
import { InscripcionController } from '../controllers/inscripcion.controller';
import { Router } from 'express';
import { authenticateToken } from '../src/middleware/auth.middleware'; // Updated import

const router = Router();

router.post('/inscripcionEvento', authenticateToken, InscripcionController.inscribirEnEvento);
export default router;