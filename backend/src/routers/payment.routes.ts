import { Router } from "express";
import { RazorpayServices } from "../services/implementation/razorpay.services";
import { UserRepository } from "../repositories/implementation/user.repository";
import { authMiddleware } from "../middlewares/auth.middleware";
import razorpay from "../utils/razorpay.util";
import { RazorpayController } from "../controllers/implementation/razorpay.controller";


const paymentRouter = Router()

const paymentServices = new RazorpayServices()
const paymentController = new RazorpayController(paymentServices)
paymentRouter.post('/create-order' , authMiddleware,paymentController.createPaymentOrder.bind(paymentController))
paymentRouter.post('/verify-payment' , authMiddleware,paymentController.verifyPayment.bind(paymentController))

export default paymentRouter