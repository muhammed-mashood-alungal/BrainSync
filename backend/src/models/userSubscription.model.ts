import mongoose, { Schema, Document, Types } from 'mongoose';
import { ISessionActivity } from '../types/sessionActivity.types';
import { IUserSubscription } from '../types/userSubscription.type';

export interface IUserSubscriptionModel extends IUserSubscription, Document {}

const subscriptionSchema = new Schema<IUserSubscriptionModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    planId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Plan',
    },
    amount: {
      type: Number,
    },
    razorpayPaymentId: {
      type: String,
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default:'active'
    },
  },
  {
    timestamps: true,
  }
);

export const UserSubscription = mongoose.model<IUserSubscriptionModel>(
  'UserSubscription',
  subscriptionSchema
);
