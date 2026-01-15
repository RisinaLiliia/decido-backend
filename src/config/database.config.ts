import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';

config();

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI not defined in .env');
}

export const DatabaseModule = MongooseModule.forRoot(process.env.MONGO_URI);
