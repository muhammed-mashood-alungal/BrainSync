import { Types } from "mongoose";
import { IReportModel } from "../../models/report.model";

export interface IReportRepository {
    reportSession(data : Partial<IReportModel>) : Promise<IReportModel>
    resolveSessionReport(reportId : Types.ObjectId) : Promise<void>
    closeSessionReport(reportId : Types.ObjectId) : Promise<void>
    getAllReportsAndCount(status : string ,  skip : number , limit : number): Promise<{reports : IReportModel[] , count : number}>
}