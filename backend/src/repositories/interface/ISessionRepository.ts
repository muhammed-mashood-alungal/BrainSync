import { ObjectId, Types } from 'mongoose';
import { ISessionModal } from '../../models/session.modal';
import { ISessionTypes } from '../../types/session.types';


export interface ISessionRepository {
  createSession(data: Partial<ISessionTypes>): Promise<ISessionModal>;
  getSessionByCode(code: string): Promise<ISessionModal | null>;
  getGroupsSessions(
    groups: Types.ObjectId[],
    sort: boolean,
    skip : number ,
    limit: number,
    searchQuery? :string,
    subject? : string,
    startDate? :string,
    endDate? : string,
  ): Promise<{sessions : ISessionModal[] , count : number}>;
  getAllSessions(
    sort: boolean,
    skip: number,
    limit: number,
    searchQuery?: string,
    subject?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{sessions : ISessionModal[] , count : number}>;
  updateSession(
    newData: ISessionModal,
    sessionId: Types.ObjectId
  ): Promise<ISessionModal | null>;
  findBySessionId(id: Types.ObjectId): Promise<ISessionModal | null>;
  stopSession(sessionId: Types.ObjectId): Promise<ISessionModal | null>;
  getTotalSessionCount() : Promise<number>
  getTotalSessionTime() : Promise<string>
  getSessionCreationTrend(
    lastXDays: number
  ): Promise<{ date: string; sessions: number }[]>
}
