import 'dotenv/config';

import http from 'http';
import cors from 'cors';
import express from 'express';
import * as loaders from './loaders';
import { errorHandler } from './middlewares';

const { NODE_ENV, DOMAIN_PROD1, DOMAIN_PROD2, DOMAIN_DEV, PORT } = process.env;
const allowedOrigins = [DOMAIN_PROD1 ? DOMAIN_PROD1 : '', DOMAIN_PROD2 ? DOMAIN_PROD2 : ''];
const DOMAINS = NODE_ENV === 'PROD' ? allowedOrigins : DOMAIN_DEV;

const app = express();

app.use(cors({ origin: DOMAINS }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
loaders.router(app);
loaders.createPassportInstance();
void loaders.mongodb();

app.use(errorHandler);

export const httpServer = http
  .createServer(app)
  .listen(PORT, () =>
    console.info(`Server running and listening at http://localhost:${PORT}. Accepting petitions from ${DOMAINS}`)
  );
