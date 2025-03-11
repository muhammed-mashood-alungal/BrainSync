import { NextFunction, Request, Response } from 'express';
import { generateAccesToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt.util';
import { JwtPayload } from 'jsonwebtoken';
import { HttpStatus } from '../constants/status.constants';
import { HttpResponse } from '../constants/responseMessage.constants';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {

    const accessToken = req.cookies.accessToken
    const refreshToken = req.cookies.refreshToken

    if (!accessToken && !refreshToken) {
        return res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.NO_TOKEN);
    }
    try {
        if (accessToken) {
            try {
                await verifyAccessToken(accessToken)
                return next()
            } catch (accessTokenErr) {
                if (refreshToken) {
                    const decoded = await verifyRefreshToken(refreshToken)
                    if (decoded) {
                        const newAccessToken = await generateAccesToken(decoded as JwtPayload)
                        res.cookie("accessToken", newAccessToken, {
                            httpOnly: true,
                            secure: false,
                            maxAge: 1 * 24 * 60 * 60 * 1000,
                            sameSite: "strict",
                        });
                    }
                } else {
                    return res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.NO_TOKEN)
                }
            }

        } else {
            const decoded = await verifyRefreshToken(refreshToken)
            if (decoded) {
                const newAccessToken = await generateAccesToken(decoded as JwtPayload)

                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 1 * 24 * 60 * 60 * 1000,
                    sameSite: "strict",
                })
            }
        }
        next()
    } catch (err) {
        return res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.TOKEN_EXPIRED)
    }
}
