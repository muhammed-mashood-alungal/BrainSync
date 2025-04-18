import { Types } from "mongoose";
import { IPlanModel, Plans } from "../../models/plans.model";
import { BaseRepository } from "../base.repositry";
import { IPlanRepository } from "../interface/IPlanRepository";

export class PlansRepository extends BaseRepository<IPlanModel> implements IPlanRepository{
    constructor(){
        super(Plans)
    }
    async createPlan(planData: Partial<IPlanModel>): Promise<IPlanModel> {
        return  await this.create(planData)
    }
    async getAllPlans(): Promise<IPlanModel[]> {
        return await this.findAll()
    }
    async getAcitvePlans(): Promise<IPlanModel[]> {
        return await this.find({isActive : true})
    }

    async updatePlan(planId: Types.ObjectId, newData: Partial<IPlanModel>): Promise<void> {
        await this.findByIdAndUpdate(planId , { 
            $set : newData
        })
    }
    async toggleActive(planId: Types.ObjectId): Promise<void> {
        await this.findByIdAndUpdate(
          planId,
          [
            {
              $set: {
                isActive: { $not: "$isActive" } 
              }
            }
          ]
        );
      }
      
}