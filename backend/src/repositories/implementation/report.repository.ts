import { Types } from 'mongoose';
import { IReportModel, Report } from '../../models/report.model';
import { BaseRepository } from '../base.repositry';
import { IReportRepository } from '../interface/IReportRepository';

export class ReportRepository
  extends BaseRepository<IReportModel>
  implements IReportRepository
{
  constructor() {
    super(Report);
  }

  async reportSession(data: Partial<IReportModel>): Promise<IReportModel> {
    return await this.create(data);
  }

  async closeSessionReport(reportId: Types.ObjectId): Promise<void> {
    await this.findByIdAndUpdate(reportId, { $set: { status: 'Closed' } });
  }

  async resolveSessionReport(reportId: Types.ObjectId): Promise<void> {
    await this.findByIdAndUpdate(reportId, { $set: { status: 'Resolved' } });
  }

  async getAllReportsAndCount(
    status: string,
    skip: number,
    limit: number
  ): Promise<{ reports: IReportModel[]; count: number }> {
    let find: any = {};
    if (status != 'All') {
      find.status = status;
    }

    const reports = await this.model
      .find(find)
      .populate('reportedBy')
      .populate('sessionId')
      .skip(skip)
      .limit(limit);
    const count = await this.model.countDocuments(find);
    return { reports, count };
  }
}
