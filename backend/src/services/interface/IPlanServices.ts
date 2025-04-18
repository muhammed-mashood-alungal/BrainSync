import { IPlanModel } from "../../models/plans.model";

export interface IPlanServices {
     createPlan(planData: Partial<IPlanModel>): Promise<IPlanModel>;
      getAllPlans(): Promise<IPlanModel[]>;
      getAcitvePlans(): Promise<IPlanModel[]>;
      updatePlan(
        planId: unknown,
        newData: Partial<IPlanModel>
      ): Promise<void>;
      toggleActive(planId: unknown): Promise<void>;
}