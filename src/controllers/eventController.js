import {
  createEvent,
  getRegistrationsForEvent,
  listEvents,
  registerForEvent,
} from '../models/eventModel.js';

export function createEventHandler(req, res) {
  const { title, date, location } = req.body;

  if (!title || !date || !location) {
    return res.status(400).json({ error: 'title, date, and location are required' });
  }

  return createEvent({ title, date, location })
    .then((event) => res.status(201).json(event))
    .catch(() => res.status(500).json({ error: 'Unable to create event' }));
}

export function listEventsHandler(req, res) {
  const { date, location } = req.query;
  return listEvents({ date, location })
    .then((events) => res.json(events))
    .catch(() => res.status(500).json({ error: 'Unable to fetch events' }));
}

export function registerUserHandler(req, res) {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  return registerForEvent(id, { name, email })
    .then((registration) => res.status(201).json(registration))
    .catch((error) => {
      if (error.code === 'EVENT_NOT_FOUND') {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (error.code === 'DUPLICATE_REGISTRATION') {
        return res.status(409).json({ error: 'User is already registered for this event' });
      }

      return res.status(500).json({ error: 'Unable to register user' });
    });
}

export function listRegistrationsHandler(req, res) {
  const { id } = req.params;

  return getRegistrationsForEvent(id)
    .then((registrations) => res.json(registrations))
    .catch((error) => {
      if (error.code === 'EVENT_NOT_FOUND') {
        return res.status(404).json({ error: 'Event not found' });
      }

      return res.status(500).json({ error: 'Unable to fetch registrations' });
    });
}
