import mongoose from 'mongoose';

export async function connectToDatabase(mongoUri) {
  if (!mongoUri) {
    throw new Error('Missing MongoDB connection string');
  }

  mongoose.set('strictQuery', true); // mongoose vhi fields accept karega jo schema mei exist karti hai

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || undefined,
  });
  return mongoose.connection;
}


