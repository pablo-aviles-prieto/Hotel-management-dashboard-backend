import { Router } from 'express';

export interface IRouter {
  path: string;
  router: Router;
}

export interface IError extends Error {
  status?: number;
  message: string;
}