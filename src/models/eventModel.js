import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  },
);

const registrationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    registeredAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.eventId = ret.eventId.toString();
        delete ret._id;
        return ret;
      },
    },
  },
);

registrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function mapDuplicateKeyError(error) {
  if (error?.code === 11000) {
    const duplicateError = new Error('Duplicate registration');
    duplicateError.code = 'DUPLICATE_REGISTRATION';
    throw duplicateError;
  }

  throw error;
}

export async function createEvent({ title, date, location }) {
  return Event.create({ title, date, location });
}

export async function listEvents({ date, location } = {}) {
  const query = {};

  if (date) {
    query.date = date;
  }

  if (location) {
    query.location = { $regex: String(location), $options: 'i' };
  }

  return Event.find(query).sort({ createdAt: 1 });
}

export async function registerForEvent(eventId, { name, email }) {
  if (!isValidObjectId(eventId)) {
    const error = new Error('Event not found');
    error.code = 'EVENT_NOT_FOUND';
    throw error;
  }

  const event = await Event.findById(eventId);

  if (!event) {
    const error = new Error('Event not found');
    error.code = 'EVENT_NOT_FOUND';
    throw error;
  }

  try {
    return await Registration.create({
      eventId: event._id,
      name,
      email: String(email).toLowerCase(),
    });
  } catch (error) {
    mapDuplicateKeyError(error);
  }
}

export async function getRegistrationsForEvent(eventId) {
  if (!isValidObjectId(eventId)) {
    const error = new Error('Event not found');
    error.code = 'EVENT_NOT_FOUND';
    throw error;
  }

  const event = await Event.findById(eventId);

  if (!event) {
    const error = new Error('Event not found');
    error.code = 'EVENT_NOT_FOUND';
    throw error;
  }

  return Registration.find({ eventId: event._id }).sort({ registeredAt: 1 });
}
