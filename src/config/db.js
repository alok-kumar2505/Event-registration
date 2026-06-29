import mongoose from 'mongoose';

export function connectDB() {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  mongoose.connect(mongoURI)
  .then(() => console.log("DataBase Connected"))
  .catch(err => console.log(err));
}

