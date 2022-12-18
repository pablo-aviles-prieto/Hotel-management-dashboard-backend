import 'dotenv/config';

import http from 'http';
import cors from 'cors';
import express from 'express';
import * as loaders from './loaders';

const app = express();
const { DOMAIN, PORT } = process.env;

// app.use(cors({ origin: DOMAIN }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
loaders.router(app);

http
  .createServer(app)
  .listen(PORT, () => console.info(`Server running and listening at http://localhost:${PORT}. Accepting petitions from ${DOMAIN}`));
