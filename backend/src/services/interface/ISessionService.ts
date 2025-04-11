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
    subject?: string,
    date?: string
  ): Promise<ISessionModal[]>;
  getAllSessions(): Promise<ISessionModal[]>;
  validateSession(
    sessionCode: string,
    userId: unknown
  ): Promise<{ status: boolean; message: string }>;
  updateSession(
    sessionData: ISessionModal,
    sessionId: unknown,
    userId: unknown
  ): Promise<ISessionModal | null>;
  stopSession(sessionId: unknown): Promise<void>;
}
