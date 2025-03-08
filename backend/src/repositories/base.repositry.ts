import { Document, FilterQuery, Model, Types, UpdateQuery, UpdateWriteOpResult } from "mongoose";

export abstract class BaseRepository <T extends Document>{
   constructor(protected  model : Model<T>){}

   async findAll() : Promise<T[]> {
    return this.model.find()
   }

   async findById(id : Types.ObjectId) : Promise <T | null> {
    return this.model.findById(id)
   }

   async find(filter : FilterQuery<T>) : Promise<T[]>{
    return this.model.find(filter)
   }

   async findOne(filter : FilterQuery<T>) : Promise<T | null>{
    return this.model.findOne(filter)
   }

   async create(data : Partial<T>): Promise<T>{
      const document = new this.model(data)
      return document.save()
   }

   async findByIdAndUpdate(id : Types.ObjectId , update : UpdateQuery<T>) : Promise<T | null> {
    return this.model.findByIdAndUpdate(id , update , {upsert : true , new : true })
   }

   async updateOne( filter : FilterQuery<T> , update : UpdateQuery<T>) : Promise<UpdateWriteOpResult>{
    return this.model.updateOne(filter , update)
   }

   async delete(id : Types.ObjectId ) : Promise<T | null >{
      return this.model.findByIdAndDelete(id)
   }

   async findOneAndDelete(filter : FilterQuery<T> ) : Promise<T | null> {
    return this.model.findOneAndDelete(filter)
   }


}

