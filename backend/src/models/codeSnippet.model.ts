import mongoose, { Document, Schema, Types } from 'mongoose';
import { ICodeSnippetTypes } from '../types/codeSnippet.types';

export interface ICodeSnippetModel extends Document, ICodeSnippetTypes {}

const codeSnippetsSchema = new Schema<ICodeSnippetModel>(
  {
   title:{
    type:String
   },
   language : {
    type :String ,
   },
   sourceCode:{
    type:String
   },
   createdBy :{
    type:Schema.Types.ObjectId,
    ref:"User"
   },
   sessionId :{
    type:Schema.Types.ObjectId,
    ref:"Session"
   }
  },
  {
    timestamps: true,
  }
);
const CodeSnippet = mongoose.model<ICodeSnippetModel>('CodeSnippet', codeSnippetsSchema);
export default CodeSnippet;
