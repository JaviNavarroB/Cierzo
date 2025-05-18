import { Router } from 'express';
import { EquipoController } from '../controllers/equipo.controller';

const router = Router();
const ctrl = new EquipoController();

// Listado de todos los equipos
router.get('/equipos', ctrl.getEquipos.bind(ctrl));

// Detalle de un equipo por ID
router.get('/equipos/:id', ctrl.getEquipo.bind(ctrl));

// Inscripciones (jugadores) de un equipo
router.get('/equipos/:id/inscripciones', ctrl.getInscripciones.bind(ctrl));

export default router;
