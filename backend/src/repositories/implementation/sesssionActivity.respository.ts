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

    switch (filterBy) {
      case 'Daily':
        dateFormat = '%Y-%m-%d';
        break;

      case 'Weekly':
        dateFormat = '%Y-%m-%d'; // Still group by day, but label as Mon, Tue, ...
        labels = Array.from({ length: 7 }).map((_, i) =>
          format(subDays(startOfToday(), 6 - i), 'EEEE')
        );
        break;

      case 'Monthly':
        dateFormat = '%Y-%m-%d'; // Just day of month
        labels = Array.from({ length: 31 }).map((_, i) =>{
            
            return `${i + 1}`
        } );
        break;

      case 'Yearly':
        dateFormat = '%m'; // Just month number
        labels = Array.from({ length: 12 }).map((_, i) =>
          format(new Date(now.getFullYear(), i, 1), 'MMM')
        );
        break;
    }

    // 🔍 Aggregate logs by formatted date
    const stats = await this.model.aggregate([
      { $match: { userId: userIdObj } },
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

    console.log(stats)

    const graphMap: Record<string, number> = {};

    stats.forEach((item , idx)  => {
      if (filterBy === 'Weekly') {
        const day = format(new Date(item._id), 'EEEE');
        graphMap[day] = Math.floor(item.totalDuration / 1000);
      } else if (filterBy === 'Monthly') {
       // const dayNum = parseInt(item._id, 10); // 01 to 30
         const day = format(new Date(now.getMonth()) , 'd')
        graphMap[String(Number(day)+1)] = Math.floor(item.totalDuration / 1000);
      } else if (filterBy === 'Yearly') {
        const monthIndex = parseInt(item._id, 10) - 1;
        const monthLabel = format(
          new Date(now.getFullYear(), monthIndex, 1),
          'MMM'
        );
        graphMap[monthLabel] = Math.floor(item.totalDuration / 1000);
      } else {
        // Daily
        graphMap[item._id] = Math.floor(item.totalDuration / 1000);
      }
    });

    let graphData: any[] = [];
    
    if (filterBy === 'Daily') {
      graphData = stats.map(item => ({
        name: new Date(item._id).toLocaleDateString(),
        duration: Math.floor(item.totalDuration / 1000),
      }));
    }  
    // else if(filterBy == 'Monthly'){
    //   graphData = stats.map(item => ({
    //     name: new Date(item._id).toLocaleDateString(),
    //     duration: Math.floor(item.totalDuration / 1000),
    //   }));
    // }
    else {
      graphData = labels.map(label => ({
        name: label,
        duration: graphMap[label] || 0,
      }));
    }
    console.log(graphData)
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
}
