import { RequestHandler } from 'express';
import {
  generateAccesToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/jwt.util';
import { JwtPayload } from 'jsonwebtoken';
import { HttpStatus } from '../constants/status.constants';
import { HttpResponse } from '../constants/responseMessage.constants';
import { env } from '../configs/env.config';
import { setAccessToken } from '../utils/cookie.util';

export const adminAuth: RequestHandler = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  if (!accessToken && !refreshToken) {
    res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.NO_TOKEN);
    return;
  }
  try {
    let decoded: JwtPayload | null = null;

    if (accessToken) {
      decoded = (await verifyAccessToken(accessToken)) as JwtPayload;
    }

    if (!decoded && accessToken) {
      decoded = (await verifyRefreshToken(refreshToken)) as JwtPayload;
      if (decoded) {
        const newAccessToken = await generateAccesToken(decoded);
        setAccessToken(res, newAccessToken);
      }
    }

    if (!decoded) {
      res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.TOKEN_EXPIRED);
      return;
    }

    if (decoded.role != 'admin') {
      res.status(HttpStatus.FORBIDDEN).json(HttpResponse.ENTRY_RESTRICTED);
      return;
    }
    next();
  } catch (err) {
    res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.TOKEN_EXPIRED);
    return;
  }
};
