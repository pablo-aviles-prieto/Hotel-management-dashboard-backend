import { BaseError } from './BaseError'; 
import { IBaseError } from '../interfaces';

export class AuthError extends BaseError {
  constructor({ message, status, additionalMessage }: IBaseError) {
    super({ message, status, additionalMessage });
  }
}
