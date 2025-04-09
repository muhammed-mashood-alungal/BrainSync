import { IReportModel } from "../../models/report.model";

export interface IReportService {
    reportSession(data: Partial<IReportModel>): Promise<IReportModel>
    resoveSessionReport(reportId: unknown): Promise<void>
    closeSessionReport(reportId: unknown): Promise<void>
    getAllReports(status: string , skip : unknown , limit : unknown) :Promise<{reports : IReportModel[] , count : number}>
}