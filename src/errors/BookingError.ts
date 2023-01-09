import { BaseError } from './BaseError'; 
import { IBaseError } from '../interfaces';

export class BookingError extends BaseError {
  constructor({ message, status, additionalMessage }: IBaseError) {
    super({ message, status, additionalMessage });

    this.name = this.constructor.name;
  }
}
