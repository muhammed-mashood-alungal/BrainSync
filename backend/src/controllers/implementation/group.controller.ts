import { Request, Response, NextFunction } from "express";
import { IGroupService } from "../../services/interface/IGroupService";
import { IGroupController } from "../interface/IGroupController";
import { HttpStatus } from "../../constants/status.constants";
import { HttpResponse } from "../../constants/responseMessage.constants";
import { createHttpsError } from "../../utils/httpError.utils";

export class GroupController implements IGroupController {
     constructor(private  _groupServices : IGroupService) {}

     async createGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const data = req.body
            await this._groupServices.createGroup(data)
            console.log('hell')
            res.status(HttpStatus.OK).json(HttpResponse.CREATED)
        }catch(err){
            next(err)
        }
     }
     async leftGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
         try {
            const {groupId} = req.params
            const {userId} = req.body
            console.log(userId)
            await this._groupServices.leftFromGroup(groupId , userId)
            res.status(HttpStatus.OK).json(HttpResponse.UPDATED)
         } catch (error) {
            next(error)
         }
     }
     async addToGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
         try {
            const {groupId} = req.params
            const {members} = req.body
            await this._groupServices.addToGroup(groupId , members)
            res.status(HttpStatus.OK).json(HttpResponse.CREATED)
         } catch (error) {
            next(error)
         }
     }
     async getAllGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
         try{
            console.log('hello')
            const groups =  await this._groupServices.allGroups()
            res.status(HttpStatus.OK).json({groups : groups})
         } catch (error) {
            next(error)
         }
     }
     async getMyGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {userId} = req.params
            
            if(userId == undefined){
               throw createHttpsError(HttpStatus.NOT_FOUND,HttpResponse.USER_NOT_FOUND)
            }
           const groups =  await this._groupServices.myGroups(userId)
           console.log(groups)
           res.status(HttpStatus.OK).json({groups:groups})
        } catch (error) {
           next(error)
        }
    }

    async getGroupData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {groupId} = req.params
            const group =  await this._groupServices.groupData(groupId)
            res.status(HttpStatus.OK).json({group : group})
         } catch (error) {
            next(error)
         }
     }
     async handleActivation (req : Request , res : Response , next : NextFunction) : Promise<void> {
        try{
            const {groupId} = req.params
            const group =  await this._groupServices.handleGroupActivation(groupId)
            res.status(HttpStatus.OK).json({group : group})
         } catch (error) {
            next(error)
         }
     }
     

}