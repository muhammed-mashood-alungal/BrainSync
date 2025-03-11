import {  RequestHandler } from 'express';
import { generateAccesToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt.util';
import { JwtPayload } from 'jsonwebtoken';
import { HttpStatus } from '../constants/status.constants';
import { HttpResponse } from '../constants/responseMessage.constants';

export const authMiddleware: RequestHandler = async (req, res, next) => {
    const accessToken = req.cookies.accessToken
    const refreshToken = req.cookies.refreshToken

    if (!accessToken && !refreshToken) {
        res.status(HttpStatus.NOT_FOUND).json(HttpResponse.NO_TOKEN)
        return
    }
    try {
        if (accessToken) {
            try {
                await verifyAccessToken(accessToken)
                next()
                return
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
                        })
                    }
                    next()
                    return
                } else {
                    res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.NO_TOKEN)
                    return
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
                next()
                return
            }
        }
    } catch (err) {
        res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.TOKEN_EXPIRED)
        return
    }
}
