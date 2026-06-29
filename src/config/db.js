import mongoose from 'mongoose';

let connectPromise;

export async function connectDatabase(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is required');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectPromise) {
    connectPromise = mongoose.connect(uri);
  }

  return connectPromise;
}

export async function disconnectDatabase() {
  connectPromise = undefined;

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}