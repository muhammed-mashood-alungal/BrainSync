import { RequestHandler } from 'express';
import { generateAccesToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt.util';
import { decode, JwtPayload } from 'jsonwebtoken';
import { HttpStatus } from '../constants/status.constants';
import { HttpResponse } from '../constants/responseMessage.constants';

export const adminAuth: RequestHandler = async (req, res, next) => {
    const accessToken = req.cookies.accessToken
    const refreshToken = req.cookies.refreshToken

    if (!accessToken && !refreshToken) {
        res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.NO_TOKEN)
        return
    }
    try {
        let decoded: JwtPayload | null = null

        if (accessToken) {
            decoded = await verifyAccessToken(accessToken) as JwtPayload
        }

        if (!decoded && accessToken) {
            decoded = await verifyRefreshToken(refreshToken) as JwtPayload
            if (decoded) {
                const newAccessToken = await generateAccesToken(decoded)
                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 1 * 24 * 60 * 60 * 1000,
                    sameSite: "strict",
                })
            }

        }

        if (!decoded) {
            res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.TOKEN_EXPIRED)
            return
        }

        if (decoded.role != 'admin') {
            res.status(HttpStatus.FORBIDDEN).json(HttpResponse.ENTRY_RESTRICTED)
            return
        }
        console.log(decoded)
        next()

    } catch (err) {
        res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.TOKEN_EXPIRED)
        return
    }
}
