import { Router } from 'express';
import {
  createEventHandler,
  listEventsHandler,
  listRegistrationsHandler,
  registerUserHandler,
} from '../controllers/eventController.js';

const router = Router();

router.post('/', createEventHandler);
router.get('/', listEventsHandler);
router.post('/:id/register', registerUserHandler);
router.get('/:id/registrations', listRegistrationsHandler);

export default router;
