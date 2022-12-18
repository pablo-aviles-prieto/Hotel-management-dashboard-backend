import { Application } from 'express';
import * as routes from '../routes';
import { IRouter } from '../interfaces';

export const router = (app: Application): void => {
  Object.values(routes).forEach((route: IRouter) => app.use(route.path, route.router));
};
