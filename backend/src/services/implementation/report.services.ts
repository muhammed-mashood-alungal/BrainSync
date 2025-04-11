import { Types } from 'mongoose';
import { IReportModel } from '../../models/report.model';
import { IReportRepository } from '../../repositories/interface/IReportRepository';
import { IReportService } from '../interface/IReportService';
import { ISessionRepository } from '../../repositories/interface/ISessionRepository';

export class ReportServices implements IReportService {
  constructor(
    private _reportRepo: IReportRepository,
    private _sessonRepo: ISessionRepository
  ) {}

  async reportSession(data: Partial<IReportModel>): Promise<IReportModel> {
    const session = await this._sessonRepo.getSessionByCode(
      data.sessionId as string
    );
    data.sessionId = session?._id as Types.ObjectId;
    return await this._reportRepo.reportSession(data);
  }
  async resoveSessionReport(reportId: unknown): Promise<void> {
    return await this._reportRepo.resolveSessionReport(
      reportId as Types.ObjectId
    );
  }
  async closeSessionReport(reportId: unknown): Promise<void> {
    return await this._reportRepo.closeSessionReport(
      reportId as Types.ObjectId
    );
  }
  async getAllReports(
    status: string,
    skip: unknown,
    limit: unknown
  ): Promise<{ reports: IReportModel[]; count: number }> {
    return await this._reportRepo.getAllReportsAndCount(
      status,
      skip as number,
      limit as number
    );
  }
}
