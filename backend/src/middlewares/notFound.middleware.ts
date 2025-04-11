import { NextFunction, Request, Response } from 'express';
import { createHttpsError } from '../utils/httpError.utils';
import { HttpStatus } from '../constants/status.constants';
import { HttpResponse } from '../constants/responseMessage.constants';

export const pageNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(createHttpsError(HttpStatus.NOT_FOUND, HttpResponse.PAGE_NOT_FOUND));
};
