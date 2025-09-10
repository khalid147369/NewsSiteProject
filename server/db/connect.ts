import mongoose from 'mongoose';


export const connectDB = async () => {
  let MONGO_URI: string = '';
  if (process.env.NODE_ENV === 'production') {
         MONGO_URI = process.env.MONGO_URI_PROD ?? '';

  }else{
        MONGO_URI = process.env.MONGO_URI ?? ''; 

  }
  
  console.log('Connecting to MongoDB with URI:', MONGO_URI);
  if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined');
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};


