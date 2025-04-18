import mongoose, { Schema, Document } from 'mongoose';
import { IPlans } from '../types/plans.types';

export interface IPlanModel extends Document, IPlans {}

const PlansSchema = new Schema<IPlanModel>(
  {
    name : {
        type : String ,
        unique : true,
        required : true
    },
    offerPrice : {
        type : Number
    },
    orginalPrice :{
        type : Number,
        required:true
    },
    interval : {
        type : String,
        enum  : ["monthly" , 'yearly']
    },
    features :[{
        title : {type : String},
        description : {type : String}
    }],
    isActive : {
        type : Boolean
    },
    isHighlighted : {
        type : Boolean
    }
  },
  {
    timestamps: true,
  }
);

export const Plans = mongoose.model<IPlanModel>('Plan', PlansSchema);
 