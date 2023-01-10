import { IBaseError } from '../interfaces';

export class BaseError extends Error {
  status: number;
  additionalMessage: string | unknown;
  constructor({ message, status, additionalMessage }: IBaseError) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message = message || 'Default error';

    this.status = status || 500;

    this.additionalMessage = additionalMessage || '';
  }
}
