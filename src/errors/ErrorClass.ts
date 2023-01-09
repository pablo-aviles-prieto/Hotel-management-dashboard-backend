interface IBaseError {
  message?: string;
  status?: number;
  additionalMessage?: string;
}

export class BaseError extends Error {
  status: number;
  additionalMessage: string;
  constructor({ message, status, additionalMessage }: IBaseError) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message = message || 'Default error';

    this.status = status || 500;

    this.additionalMessage = additionalMessage || '';
  }
}
