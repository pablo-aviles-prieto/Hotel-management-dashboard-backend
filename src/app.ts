import 'dotenv/config';

import http from 'http';
import cors from 'cors';
import express from 'express';
import * as loaders from './loaders';
import { errorHandler } from './middlewares';

const app = express();
const { DOMAIN, PORT } = process.env;

app.use(cors({ origin: DOMAIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
loaders.router(app);
loaders.createPassportInstance();
void loaders.mongodb();

app.use(errorHandler);

export const httpServer = http
  .createServer(app)
  .listen(PORT, () =>
    console.info(`Server running and listening at http://localhost:${PORT}. Accepting petitions from ${DOMAIN}`)
  );
