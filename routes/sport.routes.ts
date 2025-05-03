import { Router } from 'express';
import { DeporteController } from '../controllers/sport.controller';

const router = Router();
const ctrl = new DeporteController();

// Listado de todos los deportes
router.get('/deportes', ctrl.getDeportes.bind(ctrl));

// Detalle de un deporte por ID
router.get('/deportes/:id', ctrl.getDeporte.bind(ctrl));

export default router;
