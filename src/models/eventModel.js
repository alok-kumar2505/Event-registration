import { randomUUID } from 'node:crypto';

const events = [];
const registrations = new Map();

export function createEvent({ title, date, location }) {
  const event = {
    id: randomUUID(),
    title,
    date,
    location,
    createdAt: new Date().toISOString(),
  };

  events.push(event);
  registrations.set(event.id, []);

  return event;
}

export function listEvents({ date, location } = {}) {
  return events.filter((event) => {
    const matchesDate = !date || event.date === date;
    const matchesLocation = !location || event.location.toLowerCase().includes(String(location).toLowerCase());

    return matchesDate && matchesLocation;
  });
}

export function registerForEvent(eventId, { name, email }) {
  const event = events.find((item) => item.id === eventId);

  if (!event) {
    const error = new Error('Event not found');
    error.code = 'EVENT_NOT_FOUND';
    throw error;
  }

  const eventRegistrations = registrations.get(eventId) || [];
  const normalizedEmail = String(email).toLowerCase();
  const alreadyRegistered = eventRegistrations.some((registration) => registration.email === normalizedEmail);

  if (alreadyRegistered) {
    const error = new Error('Duplicate registration');
    error.code = 'DUPLICATE_REGISTRATION';
    throw error;
  }

  const registration = {
    id: randomUUID(),
    eventId,
    name,
    email: normalizedEmail,
    registeredAt: new Date().toISOString(),
  };

  eventRegistrations.push(registration);
  registrations.set(eventId, eventRegistrations);

  return registration;
}

export function getRegistrationsForEvent(eventId) {
  const event = events.find((item) => item.id === eventId);

  if (!event) {
    const error = new Error('Event not found');
    error.code = 'EVENT_NOT_FOUND';
    throw error;
  }

  return registrations.get(eventId) || [];
}
