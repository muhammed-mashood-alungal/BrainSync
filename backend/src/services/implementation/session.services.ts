import { Types } from 'mongoose';
import { ISessionModal } from '../../models/session.modal';
import { IGroupRepository } from '../../repositories/interface/IGroupRepository';
import { ISessionRepository } from '../../repositories/interface/ISessionRepository';
import { ISessionServices } from '../interface/ISessionService';
import { IUser } from '../../types/user.types';
import { createHttpsError } from '../../utils/httpError.utils';
import { HttpStatus } from '../../constants/status.constants';
import { HttpResponse } from '../../constants/responseMessage.constants';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../configs/env.config';
import { sendSessionLinktoAttendees } from '../../utils/sendEmail.utils';
import { IGroupTypes } from '../../types/group.types';
import { stopRoomSession } from '../../utils/socket.util';
import { ISessionActivityRepository } from '../../repositories/interface/ISessionActivity.repository';
import { DateTime } from 'luxon';
import { INotificationservices } from '../interface/INotificationServices';
import PDFDocument from 'pdfkit';
import { IUserModel } from '../../models/user.model';

export class SessionServices implements ISessionServices {
  constructor(
    private _sesionRepository: ISessionRepository,
    private _groupRepository: IGroupRepository,
    private _sessionActivityRepo: ISessionActivityRepository,
    private _notificationService: INotificationservices
  ) {}

  async createSession(
    data: Partial<ISessionModal>,
    userId: unknown
  ): Promise<ISessionModal | null> {
    const code = this.createSessionCode();
    const sessionLink = `${env.CLIENT_ORIGIN}/sessions/${code}`;

    const group = await this._groupRepository.getGroupData(
      data.groupId as Types.ObjectId
    );
    const attendeeEmails = (group?.members as IUser[]).map(user => user.email);

    const sessionDate = data?.date ?? new Date().toISOString().split('T')[0];

    console.log(data.startTime, data.endTime);
    const startTime = DateTime.fromISO(`${sessionDate}T${data.startTime}`, {
      zone: 'Asia/Kolkata',
    })
      .toUTC()
      .toJSDate();

    const endTime = DateTime.fromISO(`${sessionDate}T${data.endTime}`, {
      zone: 'Asia/Kolkata',
    })
      .toUTC()
      .toJSDate();

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

    await this._notificationService.createGroupNotification(
      {
        type: 'INFO',
        title: 'Session Scheduled',
        message: `You have a Session Scheduled on ${data?.date} from ${startTime} to ${endTime}. Please be Available`,
      },
      group?.members as Types.ObjectId[]
    );

    return await this._sesionRepository.findBySessionId(
      inserted._id as Types.ObjectId
    );
  }
  createSessionCode(): string {
    const hash = uuidv4();
    return hash.substring(0, 8).toUpperCase();
  }

  async getMySessions(
    userId: unknown,
    sort: unknown,
    skip: unknown,
    limit: unknown,
    searchQuery?: unknown,
    subject?: unknown,
    startDate?: unknown,
    endDate?: unknown
  ): Promise<{ sessions: ISessionModal[]; count: number }> {
    const myGroups = await this._groupRepository.getMyGroups(
      userId as Types.ObjectId
    );
    const groups = myGroups.map(grp => grp._id);

    const { sessions, count } = await this._sesionRepository.getGroupsSessions(
      groups as Types.ObjectId[],
      sort as boolean,
      skip as number,
      limit as number,
      searchQuery ? (searchQuery as string) : '',
      subject ? (subject as string) : '',
      startDate ? (startDate as string) : undefined,
      endDate ? (endDate as string) : undefined
    );
    return { sessions, count };
  }
  async getAllSessions(
    sort: unknown,
    skip: unknown,
    limit: unknown,
    searchQuery?: unknown,
    subject?: unknown,
    startDate?: unknown,
    endDate?: unknown
  ): Promise<{ sessions: ISessionModal[]; count: number }> {
    const { sessions, count } = await this._sesionRepository.getAllSessions(
      sort as boolean,
      skip as number,
      limit as number,
      searchQuery ? (searchQuery as string) : '',
      subject ? (subject as string) : '',
      startDate ? (startDate as string) : undefined,
      endDate ? (endDate as string) : undefined
    );

    return { sessions, count };
  }
  async validateSession(
    sessionCode: string,
    userId: unknown
  ): Promise<{
    status: boolean;
    message: string;
    sessionDetails: ISessionModal | null;
  }> {
    if (!sessionCode)
      return {
        status: false,
        message: 'Invalid Session Code',
        sessionDetails: null,
      };

    const session = await this._sesionRepository.getSessionByCode(sessionCode);
    if (!session)
      return {
        status: false,
        message: 'Session Code is Not Valid',
        sessionDetails: null,
      };
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
      return {
        status: false,
        message: 'Session Time is not reached',
        sessionDetails: null,
      };
    }

    if (session.endTime.toISOString() < currentTime) {
      return { status: false, message: 'Session Ended', sessionDetails: null };
    }
    const group = session.groupId as IGroupTypes;

    if (!group.isActive) {
      return {
        status: false,
        message: 'Group is Not Active',
        sessionDetails: null,
      };
    }
    const members = group.members as string[];
    if (!members.includes(userId as string)) {
      return {
        status: false,
        message: 'This is Session is Not Yours Group!',
        sessionDetails: null,
      };
    }

    return {
      status: true,
      message: 'Session is Valid',
      sessionDetails: session,
    };
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

    console.log(sessionData.startTime, sessionData.endTime);
    const startTime = DateTime.fromISO(
      `${sessionDate}T${sessionData.startTime}`,
      {
        zone: 'Asia/Kolkata',
      }
    )
      .toUTC()
      .toJSDate();

    const endTime = DateTime.fromISO(`${sessionDate}T${sessionData.endTime}`, {
      zone: 'Asia/Kolkata',
    })
      .toUTC()
      .toJSDate();

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

    await this._notificationService.createGroupNotification(
      {
        type: 'INFO',
        title: 'Session Updated ',
        message: `The Session Schedule for Session ${sessionData.sessionName} is Updated. Please Check new Details and Schedule`,
      },
      group?.members as Types.ObjectId[]
    );

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
    return await this._sesionRepository.getTotalSessionCount();
  }
  async getTotalSessionTime(): Promise<string> {
    return await this._sesionRepository.getTotalSessionTime();
  }
  async getSessionCreationTrend(lastXDays: unknown): Promise<any> {
    return await this._sesionRepository.getSessionCreationTrend(
      lastXDays as number
    );
  }

  private async generatePDF(data: any): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', (buffer: Buffer) => buffers.push(buffer));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err: Error) => reject(err));

        // Header
        doc.fontSize(25).text('Session Report', { align: 'center' });
        doc.moveDown();

        // Session Details
        doc.fontSize(14).text('Session Details', { underline: true });
        doc.fontSize(12).text(`Title: ${data.title}`);
        doc.text(`Session Code: ${data.sessionCode}`);
        doc.text(`Host: ${data.hostName}`);
        doc.text(`Start Time: ${new Date(data.startTime).toLocaleString()}`);
        doc.text(`End Time: ${new Date(data.endTime).toLocaleString()}`);
        doc.text(`Total Participants: ${data.totalParticipants}`);
        doc.moveDown(2);

        // Participant Summary
        doc.fontSize(14).text('Participant Summary', { underline: true });
        doc.moveDown();

        const tableTop = doc.y;
        const tableHeaders = [
          'Name',
          'Email',
          'Duration (Min)',
          'Attendance %',
        ];
        const columnWidths = [150, 200, 100, 100];

        // Draw header
        let x = 50;
        doc.fontSize(10).font('Helvetica-Bold');
        tableHeaders.forEach((header, i) => {
          doc.text(header, x, tableTop, {
            width: columnWidths[i],
            align: 'left',
          });
          x += columnWidths[i];
        });

        // Draw data rows
        doc.moveDown();
        doc.font('Helvetica');

        let yPos = doc.y;
        data.participants.forEach((participant: any) => {
          if (yPos > doc.page.height - 100) {
            doc.addPage();
            yPos = 50;
          }

          x = 50;
          doc.fontSize(10);
          doc.text(participant.name, x, yPos, {
            width: columnWidths[0],
            align: 'left',
          });
          x += columnWidths[0];

          doc.text(participant.email, x, yPos, {
            width: columnWidths[1],
            align: 'left',
          });
          x += columnWidths[1];

          doc.text(participant.totalDuration.toString(), x, yPos, {
            width: columnWidths[2],
            align: 'left',
          });
          x += columnWidths[2];

          doc.text(`${participant.attendancePercentage}%`, x, yPos, {
            width: columnWidths[3],
            align: 'left',
          });

          yPos = doc.y + 15;
          doc.moveDown(0.5);
        });

        // Detailed logs section
        doc.addPage();
        doc.fontSize(14).text('Detailed Attendance Logs', { underline: true });
        doc.moveDown();

        data.participants.forEach((participant: any) => {
          if (doc.y > doc.page.height - 150) {
            doc.addPage();
          }

          doc.fontSize(12).font('Helvetica-Bold').text(`${participant.name}`);
          doc.fontSize(10).font('Helvetica');

          if (participant.logs.length === 0) {
            doc.text('No attendance records found');
          } else {
            participant.logs.forEach((log: any, index: number) => {
              const joinTime = new Date(log.joinTime).toLocaleString();
              const leaveTime = log.leaveTime
                ? new Date(log.leaveTime).toLocaleString()
                : 'Still active';
              const duration =
                log.duration != null ? `${log.duration} Minutes` : 'N/A';

              doc
                .text(`Log #${index + 1}:`, { continued: true })
                .text(`  Join: ${joinTime}`, { continued: true })
                .text(`  Leave: ${leaveTime}`, { continued: true })
                .text(`  Duration: ${Math.round(log.duration / (1000 * 60))}`);
            });
          }
          doc.moveDown(2);
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateReport(sessionId: unknown): Promise<Buffer> {
    const session = await this._sesionRepository.findBySessionId(
      sessionId as Types.ObjectId
    );
    const activities = await this._sessionActivityRepo.getSessionActivities(
      session?.code as string
    );

    console.log(activities);
    if (!session) {
      throw createHttpsError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.INVALID_SESSION_CODE
      );
    }

    const sessionDuration =
      (new Date(session.endTime).getTime() -
        new Date(session.startTime).getTime()) /
      (1000 * 60);

    const participants = activities.map((activity: any) => {
      const attendancePercentage =
        sessionDuration > 0
          ? Math.min(
              100,
              (activity.totalDuration / (sessionDuration * 60)) * 100
            )
          : 0;

      return {
        userId: activity.userId._id,
        name: activity.userId.username,
        email: activity.userId.email,
        totalDuration: parseFloat(
          (activity.totalDuration / (1000 * 60)).toFixed(2)
        ),

        attendancePercentage: parseFloat(attendancePercentage.toFixed(2)),
        logs: activity.logs,
      };
    });

    const report = {
      sessionId: session._id,
      sessionCode: session.code,
      title: session.sessionName,
      startTime: session.startTime,
      endTime: session.endTime,
      hostName: (session.createdBy as IUserModel).username,
      totalParticipants: participants.length,
      participants,
    };

    const pdfBuffer = await this.generatePDF(report);
    return pdfBuffer;
  }
}
