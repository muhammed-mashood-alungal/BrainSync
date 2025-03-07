import mongoose from 'mongoose'
import {env} from './env.config'

const URI = env.MONGO_URI as string

if(!URI){
    throw new Error("MONGO_URI is not defined in the environment variables.")
}
export async function connectDB(){
    try{
       await mongoose.connect(URI)
       console.log('MongoDB Connected Succesfully')
    }catch(err){
       console.log(err) 
    }
}
