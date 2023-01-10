export interface IBaseError {
  name?: string;
  message?: string;
  status?: number;
  additionalMessage?: string | unknown;
}
