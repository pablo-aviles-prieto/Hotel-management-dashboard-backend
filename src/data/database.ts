import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';

config(); // Need to execute this in order to ensure that we get the env variables when transpiled.

const { DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT } = process.env;

export const db = createPool({
  host: DB_HOST,
  database: DB_NAME,
  user: DB_USERNAME,
  port: DB_PORT ? Number(DB_PORT) : 3306,
  password: DB_PASSWORD
});
