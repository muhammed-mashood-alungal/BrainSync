import { Types } from "mongoose";
import { ISessionModal } from "../../models/session.modal";
import { IGroupRepository } from "../../repositories/interface/IGroupRepository";
import { ISessionRepository } from "../../repositories/interface/ISessionRepository";
import { ISessionServices } from "../interface/ISessionService";
import { IUser } from "../../types/user.types";
import { redisClient } from "../../configs/redis.config";
import { createHttpsError } from "../../utils/httpError.utils";
import { HttpStatus } from "../../constants/status.constants";
import { HttpResponse } from "../../constants/responseMessage.constants";
import { v4 as uuidv4 } from "uuid";
import { env } from "../../configs/env.config";
import { sendSessionLinktoAttendees } from "../../utils/sendEmail.utils";

export class SessionServices implements ISessionServices {
    constructor(private _sesionRepository: ISessionRepository,
        private _groupRepository: IGroupRepository
    ) { }

    async createSession(data: Partial<ISessionModal>, userId: unknown): Promise<ISessionModal> {

        const code = this.createSessionCode(data.date as Date)
        const sessionLink = `${env.CLIENT_ORIGIN}/dashboard/sessions/${code}`

        const group = await this._groupRepository.getGroupData(data.groupId as Types.ObjectId)
        const attendeeEmails = (group?.members as IUser[]).map(user => user.email)

        
        const sessionDate = data?.date ?? new Date().toISOString().split("T")[0]

        const startTime = new Date(`${sessionDate}T${data.startTime}:00`);
        const endTime = new Date(`${sessionDate}T${data.endTime}:00`);
         
        const sessionData = {
            ...data,
            createdBy: userId as Types.ObjectId,
            startTime,
            sessionLink,
            endTime,
            code
        }
        await sendSessionLinktoAttendees( attendeeEmails , data.sessionName as string, sessionLink , startTime , endTime)


        return await this._sesionRepository.createSession(sessionData)
    }
    createSessionCode(date: Date): string {
        const hash = uuidv4()
        return hash.substring(0,8).toUpperCase()
    }

    async getMySessions(userId : unknown) : Promise<ISessionModal[]>{
        const myGroups =await this._groupRepository.getMyGroups(userId as Types.ObjectId)
        const groups  = myGroups.map(grp=>grp._id)
        console.log(groups)
        const result =  await this._sesionRepository.getGroupsSessions(groups as Types.ObjectId[])
        console.log(result)
        return result
    }
    async getAllSessions() : Promise<ISessionModal[]>{
        const result =  await this._sesionRepository.getAllSessions()
        console.log('result : '+result)
        return result
    }

}
