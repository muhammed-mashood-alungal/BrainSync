import { NextFunction, Request, Response } from 'express';
import { IPlanServices } from '../../services/interface/IPlanServices';
import { IPlanController } from '../interface/IPlanController';
import { HttpStatus } from '../../constants/status.constants';
import { successResponse } from '../../utils/response';
import { HttpResponse } from '../../constants/responseMessage.constants';

export class PlanController implements IPlanController {
  constructor(private _planServices: IPlanServices) {}

  async createPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { planData } = req.body;
      const newPlanData =await this._planServices.createPlan(planData);
      res.status(HttpStatus.CREATED).json(successResponse(HttpResponse.CREATED , {newPlanData}))
    } catch (error) {
        next(error)
    }
  }

  async getAllPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const plans = await this._planServices.getAllPlans()
        res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK , {plans}))
    } catch (error) {
        next(error)
    }
  }

  async getAcitvePlans(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const plans = await this._planServices.getAcitvePlans()
        res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK , {plans}))
      } catch (error) {
        next(error)
      }
  }
  async updatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {newData} = req.body
        const {planId } = req.params
        await this._planServices.updatePlan(planId , newData)
        res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK))
      } catch (error) {
        next(error)
      }
  }
  async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {planId} = req.params
        await this._planServices.toggleActive(planId)
        res.status(HttpStatus.OK).json(successResponse(HttpResponse.UPDATED))
      } catch (error) {
        next(error)
      }
  }
}
