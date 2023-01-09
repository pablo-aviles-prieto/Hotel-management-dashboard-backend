export interface IBaseError {
  message?: string;
  status?: number;
  additionalMessage?: string | unknown;
}
