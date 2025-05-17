import { Types } from "mongoose";
import { IPlanModel } from "../models/plans.model";

export interface IUserSubscription {
    userId: Types.ObjectId;
    planId:  Types.ObjectId;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    status: 'active' | 'expired' | 'cancelled';
    createdAt?: Date;
}


export interface IMapppedSubscription {
    planId:Types.ObjectId |  IPlanModel[];
    amount: number;
    startDate: Date;
    endDate: Date;
    status: 'active' | 'expired' | 'cancelled';
    createdAt?: Date;
}