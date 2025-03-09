import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../constants/status.constants";
import { HttpResponse } from "../constants/responseMessage.constants";
import { HttpError } from "../utils/httpError.utils";


export const errorHandler = (
    err: Error | HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    let message: string = HttpResponse.SERVER_ERROR

    if (err instanceof HttpError) {
        statusCode = err.statusCode
        message = err.message
    }
    console.error(err)

    res.status(statusCode).json({ error: message })
}