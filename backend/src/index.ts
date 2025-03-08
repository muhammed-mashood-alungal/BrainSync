import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'


dotenv.config()

const app = express()
import { env } from './configs/env.config'
import { connectDB } from './configs/mongo.config'
import { errorHandler } from './middlewares/error.middleware'
import { pageNotFound } from './middlewares/notFound.middleware'
import { connectRedis } from './configs/redis.config'


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
connectDB()
connectRedis()
app.use(cors({
    origin : env.CLIENT_ORIGIN,
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type" , "AUthorization"]
}))


app.use(pageNotFound)
app.use(errorHandler)

app.listen(env.PORT , ()=>{
    console.log(`Server Started on Port ${env.PORT}`)
})