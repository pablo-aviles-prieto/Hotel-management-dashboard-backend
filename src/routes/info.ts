import express from 'express';
import { infoController } from '../controllers';

const router = express.Router();

router.get('/', infoController.showRoutesInfo);

export const infoRoute = { path: '/info', router };
