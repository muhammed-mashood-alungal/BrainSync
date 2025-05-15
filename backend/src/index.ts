import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import session from 'express-session';
import { Server } from 'socket.io';
import http from 'http';
import setupSocket from './utils/socket.util';
dotenv.config();

const app = express();
import { env } from './configs/env.config';
//import { connectDB } from './configs/mongo.config'
import mongoDBConfig from './configs/mongo.config';
import { errorHandler } from './middlewares/error.middleware';
import { pageNotFound } from './middlewares/notFound.middleware'; 
import { connectRedis } from './configs/redis.config';

mongoDBConfig.connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectRedis();

app.use(morgan('dev'));

app.use(
  session({
    secret: env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
  })
);
import './utils/cron-job.utils'
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

setupSocket(io);

import authRouter from './routers/auth.router';
import userRouter from './routers/user.router';
import adminRouter from './routers/admin.routes';
import groupRouter from './routers/group.router';
import sessionRouter from './routers/session.router';
import noteRouter from './routers/note.router';
import reportRouter from './routers/report.routes';
import codeSnippetRouter from './routers/codeSnippet.routes';
import plansRouter from './routers/plans.router';
import paymentRouter from './routers/payment.routes';
import subscriptionRouter from './routers/subscription.routes';
import notificationRouter from './routers/notification.routes';

app.use('/api/auth/', authRouter);
app.use('/api/users/', userRouter);
app.use('/api/admin/', adminRouter);
app.use('/api/groups/', groupRouter);
app.use('/api/sessions/', sessionRouter);
app.use('/api/notes/', noteRouter);
app.use('/api/reports/', reportRouter);
app.use('/api/code-snippets', codeSnippetRouter);
app.use('/api/plans', plansRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/notifications', notificationRouter);

app.use(pageNotFound);
app.use(errorHandler);

server.listen(env.PORT, () => {
  console.log(`Server Started on Port= ${env.PORT}`);
});
