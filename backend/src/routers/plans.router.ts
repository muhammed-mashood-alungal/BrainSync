import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminAuth } from "../middlewares/admin.middleware";
import { PlansRepository } from "../repositories/implementation/plans.repository";
import { PlanServices } from "../services/implementation/plans.services";
import { PlanController } from "../controllers/implementation/plans.controller";


const plansRouter = Router()

const planRepo = new PlansRepository()
const planServices = new PlanServices(planRepo)
const planController = new PlanController(planServices)


plansRouter.post('/create' , authMiddleware , adminAuth , planController.createPlan.bind(planController))
plansRouter.get('/all-plans' , authMiddleware , adminAuth , planController.getAllPlans.bind(planController))
plansRouter.get('/active-plans'  , planController.getAcitvePlans.bind(planController))
plansRouter.put('/update/:planId' , authMiddleware , adminAuth , planController.updatePlan.bind(planController))
plansRouter.put('/toggle-plan-state/:planId' , authMiddleware , adminAuth , planController.toggleActive.bind(planController))

export default plansRouter