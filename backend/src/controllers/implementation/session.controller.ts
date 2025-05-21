import { NextFunction, Request, Response } from 'express';
import { ISessionServices } from '../../services/interface/ISessionService';
import { ISessionController } from '../interface/ISessionControllers';
import { HttpStatus } from '../../constants/status.constants';
import { HttpResponse } from '../../constants/responseMessage.constants';
import { successResponse } from '../../utils/response';

export class SessionController implements ISessionController {
  constructor(private _sessionServices: ISessionServices) {}

  async createSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;
      const userId = req.user;
      const newData = await this._sessionServices.createSession(
        data,
        userId as string
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { newSession: newData }));
    } catch (err) {
      next(err);
    }
  }
  async allSessions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { searchQuery, subject, startDate, endDate, sort, skip, limit } =
        req.query;
      const { sessions, count } = await this._sessionServices.getAllSessions(
        sort,
        skip,
        limit,
        searchQuery as string,
        subject as string,
        startDate as string,
        endDate as string
      );
      res
        .status(HttpStatus.OK)
        .json(
          successResponse(HttpResponse.OK, { sessions: sessions, count: count })
        );
    } catch (err) {
      next(err);
    }
  }
  async mySessions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user;
      const { searchQuery, subject, startDate, endDate, sort, skip, limit } =
        req.query;
      const { sessions, count } = await this._sessionServices.getMySessions(
        userId,
        sort,
        skip,
        limit,
        searchQuery as string,
        subject as string,
        startDate as string,
        endDate as string
      );

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { sessions: sessions, count }));
    } catch (err) {
      next(err);
    }
  }
  async validateSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { sessionCode } = req.params;
      const userId = req.user;
      const { status, message, sessionDetails } =
        await this._sessionServices.validateSession(sessionCode, userId);
      res.status(HttpStatus.OK).json(
        successResponse(HttpResponse.OK, {
          result: { status, message },
          sessionDetails: sessionDetails,
        })
      );
    } catch (err) {
      next(err);
    }
  }
  async updateSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { sessionId } = req.params;
      const data = req.body;
      const userId = req.user;

      const updatedSession = await this._sessionServices.updateSession(
        data,
        sessionId,
        userId
      );
      res.status(HttpStatus.OK).json(
        successResponse(HttpResponse.UPDATED, {
          updatedSession: updatedSession,
        })
      );
    } catch (err) {
      next(err);
    }
  }
  async stopSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { sessionId } = req.params;
      const response = await this._sessionServices.stopSession(sessionId);
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK));
    } catch (error) {
      next(error);
    }
  }
  async addTimeSpendOnSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user;
      const { sessionCode } = req.params;
      const { duration, log } = req.body;
      const response = await this._sessionServices.addTimeSpendOnSession(
        userId,
        sessionCode,
        duration,
        log
      );
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK));
    } catch (error) {
      next(error);
    }
  }
  async sessionReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log('Gello')
      const { sessionId } = req.params;
      const pdfBuffer = await this._sessionServices.generateReport(sessionId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=report-${sessionId}.pdf`);
      res.setHeader('Content-Length', pdfBuffer.length);

      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      next(error)
    }
  }
}
