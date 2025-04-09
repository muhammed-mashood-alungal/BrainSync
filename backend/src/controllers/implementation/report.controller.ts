import { NextFunction, Request, Response } from "express";
import { IReportService } from "../../services/interface/IReportService";
import { IReportController } from "../interface/IReportController";
import { HttpStatus } from "../../constants/status.constants";
import { successResponse } from "../../utils/response";
import { HttpResponse } from "../../constants/responseMessage.constants";

export class ReportController implements IReportController {
    constructor(private _reportService: IReportService) { }

    async reportSession(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { data } = req.body
            const userId = req.user
            data.reportedBy = userId
            const newReport = await this._reportService.reportSession(data)
            res.status(HttpStatus.CREATED).json(successResponse(HttpResponse.CREATED, { report: newReport }))
        } catch (error) {
            next(error)
        }
    }

    async resolveSessionReport(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { reportId } = req.params
            await this._reportService.resoveSessionReport(reportId)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK))
        } catch (error) {
            next(error)
        }
    }

    async closeSessionReport(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { reportId } = req.params
            await this._reportService.closeSessionReport(reportId)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK))
        } catch (error) {
            next(error)
        }
    }
    async getAllReports(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { status , skip , limit }= req.query
            const {reports , count} = await this._reportService.getAllReports(status as string , skip as string , limit as string)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK, { reports , count}))
        } catch (error) {
            next(error)
        }
    }
}