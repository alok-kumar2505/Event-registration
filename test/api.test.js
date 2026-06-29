import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

const server = app.listen(0);
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

test('manages events and registrations with unique emails per event', async (t) => {
  t.after(() => server.close());

  const eventResponse = await fetch(`${baseUrl}/events`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title: 'Product Demo', date: '2026-07-10', location: 'London' }),
  });

  assert.equal(eventResponse.status, 201);
  const event = await eventResponse.json();
  assert.equal(event.title, 'Product Demo');

  const filteredResponse = await fetch(`${baseUrl}/events?date=2026-07-10&location=lon`);
  assert.equal(filteredResponse.status, 200);
  const filteredEvents = await filteredResponse.json();
  assert.equal(filteredEvents.length, 1);
  assert.equal(filteredEvents[0].id, event.id);

  const registrationResponse = await fetch(`${baseUrl}/events/${event.id}/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'Jordan', email: 'jordan@example.com' }),
  });

  assert.equal(registrationResponse.status, 201);
  const registration = await registrationResponse.json();
  assert.equal(registration.email, 'jordan@example.com');

  const duplicateResponse = await fetch(`${baseUrl}/events/${event.id}/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'Jordan', email: 'jordan@example.com' }),
  });

  assert.equal(duplicateResponse.status, 409);

  const registrationsResponse = await fetch(`${baseUrl}/events/${event.id}/registrations`);
  assert.equal(registrationsResponse.status, 200);
  const registrations = await registrationsResponse.json();
  assert.equal(registrations.length, 1);
  assert.equal(registrations[0].name, 'Jordan');
});
