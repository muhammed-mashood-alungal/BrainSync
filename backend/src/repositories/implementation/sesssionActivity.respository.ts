import { BaseRepository } from '../base.repositry';
import { ISessionActivityModel } from '../../models/sessionActivity.model';
import { ISessionActivityRepository } from '../interface/ISessionActivity.repository';
import { SessionActivity } from '../../models/sessionActivity.model';
import mongoose, { Types } from 'mongoose';
import { format, startOfWeek, addDays, subDays, startOfToday } from 'date-fns';

export class SessionActivityRepository
  extends BaseRepository<ISessionActivityModel>
  implements ISessionActivityRepository
{
  constructor() {
    super(SessionActivity);
  }

  async addTimeSpend(
    userId: Types.ObjectId,
    sessionCode: string,
    duration: number,
    log: { joinTime: Date; leaveTime: Date; duration: number }
  ): Promise<void> {
    await this.model.findOneAndUpdate(
      { sessionCode: sessionCode, userId },
      {
        $inc: { totalDuration: duration },
        $push: {
          logs: log,
        },
      },
      { upsert: true }
    );
  }
  async getUserSessionProgress(
    userId: Types.ObjectId,
    filterBy: string
  ): Promise<{ graph: any[] }> {
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const now = new Date();
    let dateFormat = '';
    let labels: string[] = [];
    let matchCondition: any = { userId: userIdObj };

    switch (filterBy) {
      case 'Daily':
        dateFormat = '%Y-%m-%d';
        break;

      case 'Weekly':
        dateFormat = '%Y-%m-%d';
        labels = Array.from({ length: 7 }).map((_, i) =>
          format(subDays(startOfToday(), 6 - i), 'EEEE')
        );

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        matchCondition = {
          userId: userIdObj,
          'logs.joinTime': { $gte: oneWeekAgo },
        };
        break;

      case 'Monthly':
        dateFormat = '%Y-%m-%d';
        const daysInMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        ).getDate();
        labels = Array.from({ length: daysInMonth }).map((_, i) => `${i + 1}`);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        );
        matchCondition = {
          userId: userIdObj,
          'logs.joinTime': {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        };
        break;

      case 'Yearly':
        dateFormat = '%m';
        labels = Array.from({ length: 12 }).map((_, i) =>
          format(new Date(now.getFullYear(), i, 1), 'MMM')
        );

        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        matchCondition = {
          userId: userIdObj,
          'logs.joinTime': {
            $gte: startOfYear,
            $lte: endOfYear,
          },
        };
        break;
    }

    const stats = await this.model.aggregate([
      { $match: matchCondition },
      { $unwind: '$logs' },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: '$logs.joinTime',
            },
          },
          totalDuration: { $sum: '$logs.duration' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const graphMap: Record<string, number> = {};

    stats.forEach(item => {
      if (filterBy === 'Weekly') {
        const day = format(new Date(item._id), 'EEEE');
        graphMap[day] = Math.floor(item.totalDuration / 1000);
      } else if (filterBy === 'Monthly') {
        const day = format(new Date(item._id), 'd');
        graphMap[day] = Math.floor(item.totalDuration / 1000);
      } else if (filterBy === 'Yearly') {
        const monthIndex = parseInt(item._id, 10) - 1;
        const monthLabel = format(
          new Date(now.getFullYear(), monthIndex, 1),
          'MMM'
        );
        graphMap[monthLabel] = Math.floor(item.totalDuration / 1000);
      } else {
        graphMap[item._id] = Math.floor(item.totalDuration / 1000);
      }
    });

    let graphData: any[] = [];

    if (filterBy === 'Daily') {
      graphData = stats.map(item => ({
        name: new Date(item._id).toLocaleDateString(),
        duration: Math.floor(item.totalDuration / 1000),
      }));
    } else {
      graphData = labels.map(label => ({
        name: label,
        duration: graphMap[label] || 0,
      }));
    }
    console.log(graphData);
    return { graph: graphData };
  }

  async totalTimeSendByUser(userId: Types.ObjectId): Promise<string> {
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const result = await this.model.aggregate([
      {
        $match: { userId: userIdObj },
      },
      {
        $group: {
          _id: null,
          totalTime: { $sum: '$totalDuration' },
        },
      },
    ]);
    const totalMilliseconds = result[0]?.totalTime || 0;
    const totalMinutes = Math.floor(totalMilliseconds / (1000 * 60));

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  }
  async totalSessionAttendedByUser(userId: Types.ObjectId): Promise<number> {
    return await this.model.countDocuments({ userId: userId });
  }
  async getSessionActivities(
    sessionCode: string
  ): Promise<ISessionActivityModel[]> {
    return await this.model
      .find({ sessionCode: sessionCode })
      .populate('userId', 'username email');
  }
}
