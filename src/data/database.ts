import mongoose from 'mongoose';

interface IDBInfo {
  DB_USERNAME: string | undefined;
  DB_PASSWORD: string | undefined;
  DB_HOST: string | undefined;
  DB_NAME: string | undefined;
}

export const mongodbConnection = ({ DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME }: IDBInfo) => {
  const databaseUrl = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
  return mongoose.connect(databaseUrl);
};