import { ISessionModal } from '../../models/session.modal';

interface IInstructors {
  username: string;
}
export interface ISessionServices {
  createSession(
    data: Partial<ISessionModal>,
    userId: string
  ): Promise<ISessionModal | null>;
  createSessionCode(date: Date): string;
  getMySessions(
    userId: unknown,
    sort : unknown,
    skip : unknown ,
    limit : unknown,
    searchQuery?:string,
    subject? : string,
    startDate? :string | undefined,
    endDate? : string,
  ): Promise<{sessions : ISessionModal[] , count : number}>;
  getAllSessions(
    sort : unknown,
    skip : unknown ,
    limit : unknown,
    searchQuery?:unknown ,
    subject? : unknown,
    startDate? :unknown,
    endDate? : unknown,
  ): Promise<{sessions : ISessionModal[] , count : number}>;
  validateSession(
    sessionCode: string,
    userId: unknown 
  ): Promise<{ status: boolean; message: string  , sessionDetails : ISessionModal | null}>;
  updateSession(
    sessionData: ISessionModal,
    sessionId: unknown,
    userId: unknown
  ): Promise<ISessionModal | null>; 
  stopSession(sessionId: unknown): Promise<void>;
  addTimeSpendOnSession(userId : unknown ,   sessionCode: string,  duration : number , log: { joinTime: Date; leaveTime: Date; duration: number }): Promise<void>;
  totalSessionCount(): Promise<number>
  getTotalSessionTime():Promise<string>
  getSessionCreationTrend(lastXDays : unknown) : Promise<{ date: string; sessions: number }[]>
}
