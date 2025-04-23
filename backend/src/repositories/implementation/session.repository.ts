import { BaseRepository } from '../base.repositry';
import { ISessionTypes } from '../../types/session.types';
import { ISessionRepository } from '../interface/ISessionRepository';
import Session, { ISessionModal } from '../../models/session.modal';
import { ObjectId, Types } from 'mongoose';
import { startOfDay, formatISO, subDays } from 'date-fns';

export class SessionRepository
  extends BaseRepository<ISessionModal>
  implements ISessionRepository
{
  constructor() {
    super(Session);
  }
  async findBySessionId(id: Types.ObjectId): Promise<ISessionModal | null> {
    return await this.model
      .findById(id)
      .populate('createdBy')
      .populate('groupId');
  }
  async createSession(data: Partial<ISessionTypes>): Promise<ISessionModal> {
    return await this.create(data);
  }
  async getSessionByCode(code: string): Promise<ISessionModal | null> {
    return await this.model
      .findOne({ code: code })
      .populate('createdBy')
      .populate('groupId');
  }
  async getGroupsSessions(
    groups: Types.ObjectId[],
    sort: boolean,
    skip: number,
    limit: number,
    searchQuery?: string,
    subject?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ sessions: ISessionModal[]; count: number }> {
    console.log(sort);
    let sortOrder: 1 | -1 = sort == true ? 1 : -1;
    let find: any = {};
    if (subject) {
      find.subject = { $regex: subject, $options: 'i' };
    }
    console.log('start and end Date');
    console.log(startDate, endDate);
    console.log(((startDate as string) + endDate) as string);

    if (startDate && endDate && startDate != 'null' && endDate != 'null') {
      const start = new Date(startDate as string);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);

      find.date = {
        $gt: start,
        $lt: end,
      };
    }
    if (searchQuery) {
      find.sessionName = { $regex: searchQuery, $options: 'i' };
    }
    console.log(sortOrder);
    const count = await this.model.countDocuments({
      ...find,
      groupId: { $in: groups },
    });
    const sessions = await this.model
      .find({ ...find, groupId: { $in: groups } })
      .skip(skip)
      .limit(limit)
      .sort({ date: sortOrder })
      .populate('createdBy')
      .populate('groupId');
    return { sessions, count };
  }

  async getAllSessions(
    sort: boolean,
    skip: number,
    limit: number,
    searchQuery?: string,
    subject?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ sessions: ISessionModal[]; count: number }> {
    console.log(sort);
    let sortOrder: 1 | -1 = sort == true ? 1 : -1;
    let find: any = {};
    console.log(subject)
    if (subject) {
      find.subject = { $regex: subject, $options: 'i' };
    }

    if (startDate && endDate && startDate != 'null' && endDate != 'null') {
      const start = new Date(startDate as string);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);

      find.date = {
        $gt: start,
        $lt: end,
      };
    }
    if (searchQuery) {
      find.sessionName = { $regex: searchQuery, $options: 'i' };
    }
    console.log(sortOrder);
    console.log(find)
    const count = await this.model.countDocuments(find);
    const sessions = await this.model
      .find(find)
      .skip(skip)
      .limit(limit)
      .sort({ date: sortOrder })
      .populate('createdBy')
      .populate('groupId');
     console.log(count)
    return { sessions, count };
  }
  async updateSession(
    newData: ISessionModal,
    sessionId: Types.ObjectId
  ): Promise<ISessionModal | null> {
    return await this.model
      .findByIdAndUpdate(
        sessionId,
        {
          $set: newData,
        },
        { new: true }
      )
      .populate(['createdBy', 'groupId']);
  }
  async stopSession(sessionId: Types.ObjectId): Promise<ISessionModal | null> {
    return await this.findByIdAndUpdate(sessionId, {
      $set: { isStopped: true },
    });
  }
  async getTotalSessionCount(): Promise<number> {
    return await this.model.countDocuments({});
  }

  async getTotalSessionTime(): Promise<string> {
    const sessions = await this.model.find({}, 'startTime endTime');

    let totalMilliseconds = 0;

    sessions.forEach(session => {
      if (session.startTime && session.endTime) {
        const duration =
          session.endTime.getTime() - session.startTime.getTime();
        totalMilliseconds += duration;
      }
    });

    // Convert total milliseconds to hours, minutes, seconds
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  async getSessionCreationTrend(
    lastXDays: number
  ): Promise<{ date: string; sessions: number }[]> {
    const today = startOfDay(new Date());
    const startDate = subDays(today, lastXDays - 1);

    const sessions = await this.model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          sessions: '$count',
        },
      },
    ]);

    const sessionMap = new Map(
      sessions.map(item => [item.date, item.sessions])
    );

    const result = Array.from({ length: lastXDays }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const formatted = date.toISOString().split('T')[0];

      return {
        date: formatted,
        sessions: sessionMap.get(formatted) || 0,
      };
    });

    return result;
  }
}
