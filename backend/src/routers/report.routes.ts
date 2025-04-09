import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ReportRepository } from "../repositories/implementation/report.repository";
import { ReportServices } from "../services/implementation/report.services";
import { ReportController } from "../controllers/implementation/report.controller";
import { SessionRepository } from "../repositories/implementation/session.repository";
import { adminAuth } from "../middlewares/admin.middleware";

const reportRouter = Router()

const reportRepo = new ReportRepository()
const sessionRepo = new SessionRepository()
const reportService = new ReportServices(reportRepo , sessionRepo)
const reportController = new ReportController(reportService)
reportRouter.use(authMiddleware)

reportRouter.post('/report-session', reportController.reportSession.bind(reportController))
reportRouter.put('/resolve-session-report/:reportId', reportController.resolveSessionReport.bind(reportController))
reportRouter.put('/close-session-report/:reportId', reportController.closeSessionReport.bind(reportController))
reportRouter.get('/all-reports', adminAuth , reportController.getAllReports.bind(reportController))

export default reportRouter