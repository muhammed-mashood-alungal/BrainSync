import { NextFunction, Request, Response } from 'express';
import { generateAccesToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt.util';
import { JwtPayload } from 'jsonwebtoken';
import { HttpStatus } from '../constants/status.constants';
import { HttpResponse } from '../constants/responseMessage.constants';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
        return res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.NO_TOKEN);
    }

    try {
        verifyAccessToken(accessToken)
        //  req.user = decoded;
        next();
    } catch (err: unknown) {
        if (err instanceof Error)
            if (err.name === 'TokenExpiredError' && refreshToken) {
                try {
                    const decodedRefresh = verifyRefreshToken(refreshToken)
                    const newAccessToken = generateAccesToken(decodedRefresh as JwtPayload)
                   
 

                    res.cookie("accessToken", newAccessToken, {
                        httpOnly: true,
                        secure: false,
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        sameSite: "strict",
                    })


                    //req.user = jwt.verify(newAccessToken, process.env.ACCESS_TOKEN_SECRET);
                    next()
                } catch (refreshErr) {
                    return res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.TOKEN_EXPIRED);
                }
            } else {
                return res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.TOKEN_EXPIRED);
            }
    }
}
