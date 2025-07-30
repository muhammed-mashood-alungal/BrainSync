import { RequestHandler } from 'express';
import { IUserRepository } from '../repositories/interface/IUserRepository';
import { HttpStatus } from '../constants/status.constants';
import { HttpResponse } from '../constants/responseMessage.constants';

export const verifyUser: RequestHandler = (req, res, next) => {
  try {
    const { userId } = req.params;
    if (userId !== req.user) {
      res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.UNAUTHORIZED);
      return;
    }
    next();
  } catch (err) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(HttpResponse.SERVER_ERROR);
  }
};
