import { Response } from 'express';
import { env } from '../configs/env.config';

export const setAccessToken = (res: Response, token: string) => {
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    maxAge: 1 * 24 * 60 * 60 * 1000,
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: env.NODE_ENV === 'production' ? '.brainsync.space' : undefined,
    path: '/',
  });
};

export const setRefreshToken = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: env.NODE_ENV === 'production' ? '.brainsync.space' : undefined,
    path: '/',
  });
};

export const clearCookie = (cookieName: string, res: Response) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: env.NODE_ENV === 'production' ? '.brainsync.space' : undefined,
    path: '/',
  });
};
