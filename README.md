# Events API

Simple Node.js and Express API for managing events and registrations using an MVC structure with MongoDB Atlas.

## Setup

```bash
npm install
npm start
```

Development mode:

```bash
npm run dev
```

The server reads `PORT` and `MONGODB_URI` from [/.env](/Users/alokkumar/Desktop/Project%202/.env). `MONGODB_URI` should be your MongoDB Atlas connection string.

## Base URL

```text
http://localhost:3000
```

## Routes

### POST `/events`
Create a new event.

Request body:

```json
{
  "title": "Launch Party",
  "date": "2026-07-01",
  "location": "Berlin"
}
```

Success response: `201 Created`

```json
{
  "id": "event-id",
  "title": "Launch Party",
  "date": "2026-07-01",
  "location": "Berlin",
  "createdAt": "2026-06-29T00:00:00.000Z"
}
```

Error response: `400 Bad Request`

```json
{
  "error": "title, date, and location are required"
}
```

### GET `/events`
List events. Optional filters: `date` and `location`.

Example:

```text
/events?date=2026-07-01&location=ber
```

Success response: `200 OK`

```json
[
  {
    "id": "event-id",
    "title": "Launch Party",
    "date": "2026-07-01",
    "location": "Berlin",
    "createdAt": "2026-06-29T00:00:00.000Z"
  }
]
```

### POST `/events/:id/register`
Register a user for an event.

Request body:

```json
{
  "name": "Alex",
  "email": "alex@example.com"
}
```

Success response: `201 Created`

```json
{
  "id": "registration-id",
  "eventId": "event-id",
  "name": "Alex",
  "email": "alex@example.com",
  "registeredAt": "2026-06-29T00:00:00.000Z"
}
```

Error responses:

`400 Bad Request`

```json
{
  "error": "name and email are required"
}
```

`404 Not Found`

```json
{
  "error": "Event not found"
}
```

`409 Conflict`

```json
{
  "error": "User is already registered for this event"
}
```

### GET `/events/:id/registrations`
Get all registrations for an event.

Success response: `200 OK`

```json
[
  {
    "id": "registration-id",
    "eventId": "event-id",
    "name": "Alex",
    "email": "alex@example.com",
    "registeredAt": "2026-06-29T00:00:00.000Z"
  }
]
```

Error response: `404 Not Found`

```json
{
  "error": "Event not found"
}
```

## Notes

- Data is stored in MongoDB Atlas, so it persists across restarts.
- Registration emails are unique per event.