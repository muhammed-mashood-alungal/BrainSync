import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import session from "express-session";
dotenv.config()

const app = express()
import { env } from './configs/env.config'
import { connectDB } from './configs/mongo.config'
import { errorHandler } from './middlewares/error.middleware'
import { pageNotFound } from './middlewares/notFound.middleware'
import { connectRedis } from './configs/redis.config'


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
connectDB()
connectRedis() 
 
app.use(morgan("dev"))

app.use(session({
    secret: env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  
}));

app.use(cors({ 
    origin: env.CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
}))

import authRouter from './routers/auth.router'
import userRouter from './routers/user.router'
import adminRouter from './routers/admin.routes'
import groupRouter from './routers/group.router'

app.use('/api/auth/',authRouter) 
app.use('/api/users/',userRouter) 
app.use('/api/admin/',adminRouter) 
app.use('/api/groups/',groupRouter) 
app.use(pageNotFound)
app.use(errorHandler)

app.listen(env.PORT, () => {
    console.log(`Server Started on Port ${env.PORT}`) 
}) 