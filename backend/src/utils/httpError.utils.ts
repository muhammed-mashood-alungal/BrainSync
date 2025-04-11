export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createHttpsError = (statusCode: number, message: string) => {
  const errResponse = new HttpError(statusCode, message);
  return errResponse;
};
