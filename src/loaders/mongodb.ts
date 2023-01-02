import { mongodbConnection } from '../data/database';
import { config } from 'dotenv';

config();

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

export const mongodb = async () => {
  try {
    console.log('DB_USERNAME', DB_USERNAME);
    const mongoConnection = await mongodbConnection({ DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME });
    const { databaseName } = mongoConnection.connections[0].db;
    console.log(`Connected to Mongo! Database name: ${databaseName}`);
  } catch (error: unknown) {
    console.error(`Error connecting to mongo database, Error description: ${error}`);
  }
};
