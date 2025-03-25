import {  RequestHandler } from 'express';
import { generateAccesToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt.util';
import { JwtPayload } from 'jsonwebtoken';
import { HttpStatus } from '../constants/status.constants';
import { HttpResponse } from '../constants/responseMessage.constants';

export const authMiddleware: RequestHandler = async (req, res, next) => {
    const accessToken = req.cookies.accessToken
    const refreshToken = req.cookies.refreshToken
    console.log(accessToken , refreshToken)
    if (!accessToken && !refreshToken) {
        console.log(HttpResponse.NO_TOKEN)
        res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.UNAUTHORIZED)
        return
    }
    try {      
        if (accessToken) {
            try {
                const decoded = await verifyAccessToken(accessToken)
                req.user = decoded?.id as string
                next()
                return
            } catch (accessTokenErr) {
                if (refreshToken) {
                    const decoded = await verifyRefreshToken(refreshToken)
                    req.user = decoded?.id as string
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
            req.user = decoded?.id as JwtPayload
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
