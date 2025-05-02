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

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  if (!accessToken && !refreshToken) {
    res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.UNAUTHORIZED);
    return;
  }
  try {
    if (accessToken) {
      try {
        const decoded = await verifyAccessToken(accessToken);
        req.user = decoded?.id as string;
        next();
        return;
      } catch (accessTokenErr) {
        if (refreshToken) {
          const decoded = await verifyRefreshToken(refreshToken);
          req.user = decoded?.id as string;
          if (decoded) {
            const newAccessToken = await generateAccesToken(
              decoded as JwtPayload
            );
            setAccessToken(res, newAccessToken);
          }
          next();
          return;
        } else {
          res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.NO_TOKEN);
          return;
        }
      }
    } else {
      const decoded = await verifyRefreshToken(refreshToken);
      req.user = decoded?.id as JwtPayload;
      if (decoded) {
        const newAccessToken = await generateAccesToken(decoded as JwtPayload);
        setAccessToken(res, newAccessToken);
        next();
        return;
      }
    }
  } catch (err) {
    res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.TOKEN_EXPIRED);
    return;
  }
};
