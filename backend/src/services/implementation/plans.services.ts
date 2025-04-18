import { Types } from "mongoose";
import { IPlanModel } from "../../models/plans.model";
import { IPlanRepository } from "../../repositories/interface/IPlanRepository";
import { IPlanServices } from "../interface/IPlanServices";

export class PlanServices implements IPlanServices{
    constructor(private _planRepo : IPlanRepository) {}

    async createPlan(planData: Partial<IPlanModel>): Promise<IPlanModel> {
       return await this._planRepo.createPlan(planData)
    }
    async getAllPlans(): Promise<IPlanModel[]> {
        return await this._planRepo.getAllPlans()
    }
    async getAcitvePlans(): Promise<IPlanModel[]> {
        return await this._planRepo.getAcitvePlans()
    }
    async updatePlan(planId: unknown, newData: Partial<IPlanModel>): Promise<void> {
        return await this._planRepo.updatePlan(planId as Types.ObjectId , newData)
    }
    async toggleActive(planId: unknown): Promise<void> {
        return await this._planRepo.toggleActive(planId as Types.ObjectId)
    }
}