import { mongodbConnection } from '../data/database';
import { config } from 'dotenv';

config();

const { NODE_ENV, DB_USERNAME_PROD, DB_USERNAME_DEV, DB_PASSWORD, DB_HOST_DEV, DB_HOST_PROD, DB_NAME } = process.env;

export const mongodb = async () => {
  try {
    const mongoConnection = await mongodbConnection({
      NODE_ENV,
      DB_USERNAME_PROD,
      DB_USERNAME_DEV,
      DB_PASSWORD,
      DB_HOST_DEV,
      DB_HOST_PROD,
      DB_NAME
    });
    const { databaseName } = mongoConnection.connections[0].db;
    console.log(`Connected to Mongo! (${NODE_ENV === 'PROD' ? 'PROD DB' : 'DEV DB'}) Database name: ${databaseName}`);
  } catch (error: unknown) {
    console.error(`Error connecting to mongo database, Error description: ${error}`);
  }
};
