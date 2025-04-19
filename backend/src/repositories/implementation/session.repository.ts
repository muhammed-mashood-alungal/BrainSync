import { BaseRepository } from '../base.repositry';
import { ISessionTypes } from '../../types/session.types';
import { ISessionRepository } from '../interface/ISessionRepository';
import Session, { ISessionModal } from '../../models/session.modal';
import { ObjectId, Types } from 'mongoose';
import { startOfDay, formatISO, subDays } from 'date-fns';

interface IFilter {
  subject?: string;
  date?: {};
}

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
    filter: IFilter
  ): Promise<ISessionModal[]> {
    return await this.model
      .find({ ...filter, groupId: { $in: groups } })
      .sort({ createdAt: -1 })
      .populate('createdBy')
      .populate('groupId');
  }
  async getAllSessions(): Promise<ISessionModal[]> {
    return await this.model
      .find({})
      .populate('createdBy')
      .populate('groupId')
      .sort({ createdAt: -1 });
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

    // Fetch sessions created in the date range
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

    // Convert aggregation to a map for quick lookup
    const sessionMap = new Map(
      sessions.map(item => [item.date, item.sessions])
    );

    // Build the full trend array, including dates with 0 sessions
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
