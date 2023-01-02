import { mongodbConnection } from '../data/database';

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

export const mongodb = async () => {
  try {
    const mongoConnection = await mongodbConnection({ DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME });
    const { databaseName } = mongoConnection.connections[0].db;
    console.log(`Connected to Mongo! Database name: ${databaseName}`);
  } catch (error: unknown) {
    console.error(`Error connecting to mongo database, Error description: ${error}`);
  }
};
