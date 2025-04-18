import { Types } from 'mongoose';
import { IPlanModel } from '../../models/plans.model';

export interface IPlanRepository {
  createPlan(planData: Partial<IPlanModel>): Promise<IPlanModel>;
  getAllPlans(): Promise<IPlanModel[]>;
  getAcitvePlans(): Promise<IPlanModel[]>;
  updatePlan(
    planId: Types.ObjectId,
    newData: Partial<IPlanModel>
  ): Promise<void>;
  toggleActive(planId: Types.ObjectId): Promise<void>;
}
