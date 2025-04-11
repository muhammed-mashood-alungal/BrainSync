import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../configs/env.config';

const ACCESS_SECRET = env.JWT_ACCESS_KEY as string;
const REFRESH_SECRET = env.JWT_REFRESH_KEY as string;

export function generateAccesToken(payload: object) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: 20000 });
}
export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: 20000 });
}
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
  } catch (err) {
    console.error(err);
    return null;
  }
}
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
  } catch (err) {
    console.error(err);
    return null;
  }
}
