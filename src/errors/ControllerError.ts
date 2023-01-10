import { BaseError } from './BaseError';
import { IBaseError } from '../interfaces';

export class ControllerError extends BaseError {
  constructor({ name, message, status, additionalMessage }: IBaseError) {
    super({ message, status, additionalMessage });

    this.name = name || 'ControllerError';
  }
}
