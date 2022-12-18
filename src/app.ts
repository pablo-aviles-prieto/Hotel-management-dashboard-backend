import 'dotenv/config';

import http from 'http';
import cors from 'cors';
import express from 'express';

const app = express();
const { DOMAIN, PORT } = process.env;

app.use(cors({ origin: DOMAIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

http
  .createServer(app)
  .listen(PORT, () => console.info(`Server running and listening at http://localhost:${PORT}. Accepting petitions from ${DOMAIN}`));
