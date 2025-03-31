// routes/usuario.route.ts
import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import Event from '../models/event.model';

const router = Router();
const eventControllerInstance = new EventController();


router.get('/events', eventControllerInstance.getEvents);
router.get('/event/:id', eventControllerInstance.getEvent);
export default router;