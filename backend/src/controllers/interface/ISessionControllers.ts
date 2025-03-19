import { NextFunction, Request, Response } from "express";

export interface ISessionController {
     create(req:Request, res :Response , next : NextFunction) : Promise<void>
}