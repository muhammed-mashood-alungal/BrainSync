import { Router } from "express";
import { SessionRepository } from "../repositories/implementation/session.repository";
import { SessionServices } from "../services/implementation/session.services";
import { SessionController } from "../controllers/implementation/session.controller";
import { GroupRepository } from "../repositories/implementation/group.repository";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminAuth } from "../middlewares/admin.middleware";

const sessionRouter = Router()

const sessionRepo = new SessionRepository()
const groupRepo = new GroupRepository()
const sessionServices = new SessionServices(sessionRepo,groupRepo)
const sessionController = new SessionController(sessionServices)


sessionRouter.post('/create' , authMiddleware,sessionController.create.bind(sessionController))
sessionRouter.get('/' , adminAuth , sessionController.allSessions.bind(sessionController))
sessionRouter.get('/my-sessions' , authMiddleware , sessionController.mySessions.bind(sessionController))

export default sessionRouter