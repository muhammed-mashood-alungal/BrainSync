import { Types } from 'mongoose';
import { ISessionModal } from '../../models/session.modal';
import { IGroupRepository } from '../../repositories/interface/IGroupRepository';
import { ISessionRepository } from '../../repositories/interface/ISessionRepository';
import { ISessionServices } from '../interface/ISessionService';
import { IUser } from '../../types/user.types';
import { redisClient } from '../../configs/redis.config';
import { createHttpsError } from '../../utils/httpError.utils';
import { HttpStatus } from '../../constants/status.constants';
import { HttpResponse } from '../../constants/responseMessage.constants';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../configs/env.config';
import { sendSessionLinktoAttendees } from '../../utils/sendEmail.utils';
import { IGroupTypes } from '../../types/group.types';
import { stopRoomSession } from '../../utils/socket.util';
import { ISessionActivityRepository } from '../../repositories/interface/ISessionActivity.repository';

export class SessionServices implements ISessionServices {
  constructor(
    private _sesionRepository: ISessionRepository,
    private _groupRepository: IGroupRepository,
    private _sessionActivityRepo: ISessionActivityRepository
  ) {}

  async createSession(
    data: Partial<ISessionModal>,
    userId: unknown
  ): Promise<ISessionModal | null> {
    const code = this.createSessionCode(data.date as Date);
    const sessionLink = `${env.CLIENT_ORIGIN}/sessions/${code}`;

    const group = await this._groupRepository.getGroupData(
      data.groupId as Types.ObjectId
    );
    const attendeeEmails = (group?.members as IUser[]).map(user => user.email);

    const sessionDate = data?.date ?? new Date().toISOString().split('T')[0];

    const startTime = new Date(`${sessionDate}T${data.startTime}:00`);
    const endTime = new Date(`${sessionDate}T${data.endTime}:00`);

    const sessionData = {
      ...data,
      createdBy: userId as Types.ObjectId,
      startTime,
      sessionLink,
      endTime,
      code,
    };
    await sendSessionLinktoAttendees(
      attendeeEmails,
      data.sessionName as string,
      sessionLink,
      startTime,
      endTime
    );

    const inserted = await this._sesionRepository.createSession(sessionData);
    return await this._sesionRepository.findBySessionId(
      inserted._id as Types.ObjectId
    );
  }
  createSessionCode(date: Date): string {
    const hash = uuidv4();
    return hash.substring(0, 8).toUpperCase();
  }

  async getMySessions(
    userId: unknown,
    sort : unknown,
    skip : unknown ,
    limit : unknown,
    searchQuery?:unknown ,
    subject? : unknown,
    startDate? :unknown,
    endDate? : unknown,
  ): Promise<{sessions : ISessionModal[] , count : number}> {
    const myGroups = await this._groupRepository.getMyGroups(
      userId as Types.ObjectId
    );
    const groups = myGroups.map(grp => grp._id);
    
    console.log(startDate , endDate)
    const {sessions , count} = await this._sesionRepository.getGroupsSessions(
      groups as Types.ObjectId[],
      sort as boolean,
      skip as number,
      limit as number,
      searchQuery ? searchQuery as string : '',
      subject ? subject as string  : ''  ,
      startDate ? startDate as string : undefined,
      endDate? endDate as string : undefined
    );
    return {sessions , count};
  }
  async getAllSessions(
    sort : unknown,
    skip : unknown ,
    limit : unknown,
    searchQuery?:unknown ,
    subject? : unknown,
    startDate? :unknown,
    endDate? : unknown,
  ): Promise<{sessions : ISessionModal[] , count : number}> {
    const {sessions , count} = await this._sesionRepository.getAllSessions(
      sort as boolean,
      skip as number,
      limit as number,
      searchQuery ? searchQuery as string : '',
      subject ? subject as string  : ''  ,
      startDate ? startDate as string : undefined,
      endDate? endDate as string : undefined
    );
     
    return {sessions , count};
  }
  async validateSession(
    sessionCode: string,
    userId: unknown
  ): Promise<{ status: boolean; message: string  , sessionDetails : ISessionModal | null}> {
    if (!sessionCode) return { status: false, message: 'Invalid Session Code'  , sessionDetails : null};

    const session = await this._sesionRepository.getSessionByCode(sessionCode);
    if (!session)
      return { status: false, message: 'Session Code is Not Valid', sessionDetails : null };
    const currentTime = new Date().toISOString();

    const startTime =
      session.startTime instanceof Date
        ? session.startTime
        : new Date(session.startTime);
    const endTime =
      session.endTime instanceof Date
        ? session.endTime
        : new Date(session.endTime);

    if (session.startTime.toISOString() > currentTime) {
      return { status: false, message: 'Session Time is not reached' , sessionDetails : null};
    }

    if (session.endTime.toISOString() < currentTime) {
      return { status: false, message: 'Session Ended', sessionDetails : null };
    }
    const group = session.groupId as IGroupTypes;

    if (!group.isActive) {
      return { status: false, message: 'Group is Not Active' , sessionDetails : null};
    }
    const members = group.members as string[];
    if (!members.includes(userId as string)) {
      return { status: false, message: 'This is Session is Not Yours Group!', sessionDetails : null };
    }

    return { status: true, message: 'Session is Valid' , sessionDetails : session };
  }
  async updateSession(
    sessionData: ISessionModal,
    sessionId: unknown,
    userId: unknown
  ): Promise<ISessionModal | null> {
    const session = await this._sesionRepository.findBySessionId(
      sessionId as Types.ObjectId
    );

    if (!session) {
      createHttpsError(HttpStatus.NOT_FOUND, HttpResponse.RESOURCE_NOT_FOUND);
    }

    const currentDate = new Date();

    if (
      session?.startTime &&
      session?.endTime &&
      session?.startTime < currentDate &&
      currentDate < session?.endTime
    ) {
      createHttpsError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.CANNOT_UPDATE_LIVE_SESSION
      );
    }

    if (session?.createdBy._id != userId) {
      createHttpsError(
        HttpStatus.FORBIDDEN,
        HttpResponse.NOT_CREATER_OF_SESSION
      );
    }

    const group = await this._groupRepository.getGroupData(
      sessionData.groupId as Types.ObjectId
    );
    const attendeeEmails = (group?.members as IUser[]).map(user => user.email);

    let dateParts = (sessionData.date + '').split('/');
    let date = sessionData.date;

    if (dateParts.length > 1) {
      date = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
    }

    const sessionDate = sessionData.date
      ? new Date(date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const startTime = new Date(`${sessionDate}T${sessionData.startTime}:00`);
    const endTime = new Date(`${sessionDate}T${sessionData.endTime}:00`);

    if (
      endTime.getTime() < currentDate.getTime() ||
      endTime.getDate() < currentDate.getDate()
    ) {
      throw createHttpsError(HttpStatus.FORBIDDEN, HttpResponse.ENDED_SESSION);
    }

    await sendSessionLinktoAttendees(
      attendeeEmails,
      sessionData.sessionName as string,
      session?.sessionLink as string,
      startTime,
      endTime
    );

    sessionData.startTime = startTime;
    sessionData.endTime = endTime;
    sessionData.date = sessionDate;

    return await this._sesionRepository.updateSession(
      sessionData,
      sessionId as Types.ObjectId
    );
  }

  async stopSession(sessionId: unknown): Promise<void> {
    const session = await this._sesionRepository.stopSession(
      sessionId as Types.ObjectId
    );
    stopRoomSession(session?.code as string);
  }
  async addTimeSpendOnSession(
    userId: unknown,
    sessionCode: string,
    duration: number,
    log: { joinTime: Date; leaveTime: Date; duration: number }
  ): Promise<void> {
    await this._sessionActivityRepo.addTimeSpend(
      userId as Types.ObjectId,
      sessionCode,
      duration,
      log
    );
  }
  async totalSessionCount(): Promise<number> {
    return await this._sesionRepository.getTotalSessionCount()
  }
  async getTotalSessionTime(): Promise<string> {
    return await this._sesionRepository.getTotalSessionTime()
  }
  async getSessionCreationTrend(lastXDays: unknown): Promise<any> {
    return await this._sesionRepository.getSessionCreationTrend(lastXDays as number)
  }
}
