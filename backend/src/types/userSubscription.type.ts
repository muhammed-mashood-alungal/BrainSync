import { Types } from "mongoose";

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