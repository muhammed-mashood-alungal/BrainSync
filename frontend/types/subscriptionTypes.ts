import { IPlans } from "./plans.types";
import { IUserType } from "./userTypes";

export interface IUserSubscription {
    userId: string | IUserType;
    planId: string |IPlans;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    status: 'active' | 'expired' | 'cancelled';
    createdAt?: Date;
}