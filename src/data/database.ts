import mongoose from 'mongoose';

interface IDBInfo {
  NODE_ENV: string | undefined;
  DB_USERNAME_PROD: string | undefined;
  DB_USERNAME_DEV: string | undefined;
  DB_PASSWORD: string | undefined;
  DB_HOST_PROD: string | undefined;
  DB_HOST_DEV: string | undefined;
  DB_NAME: string | undefined;
}

export const mongodbConnection = ({
  NODE_ENV,
  DB_USERNAME_PROD,
  DB_USERNAME_DEV,
  DB_PASSWORD,
  DB_HOST_PROD,
  DB_HOST_DEV,
  DB_NAME
}: IDBInfo) => {
  const DB_PROTOCOL = NODE_ENV === 'PROD' ? 'mongodb+srv' : 'mongodb';
  const DB_HOST = NODE_ENV === 'PROD' ? DB_HOST_PROD : DB_HOST_DEV;
  const DB_USERNAME = NODE_ENV === 'PROD' ? DB_USERNAME_PROD : DB_USERNAME_DEV;
  const databaseUrl = `${DB_PROTOCOL}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
  return mongoose.connect(databaseUrl);
};
