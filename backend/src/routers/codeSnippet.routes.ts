import { Router } from "express";
import { CodeSnippetRepository } from "../repositories/implementation/codeSnippet.repository";
import { CodeSnippetServices } from "../services/implementation/codeSnippets.services";
import { CodeSnippetController } from "../controllers/implementation/codeSnippet.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { SessionRepository } from "../repositories/implementation/session.repository";

const sessionRepo = new SessionRepository()
const snippetRepo  = new CodeSnippetRepository()
const snippetServices = new CodeSnippetServices(snippetRepo , sessionRepo)
const snippetController = new  CodeSnippetController(snippetServices)

const codeSnippetRouter = Router()

codeSnippetRouter.use(authMiddleware)

codeSnippetRouter.post('/save', snippetController.saveCodeSnippet.bind(snippetController))
codeSnippetRouter.get('/user-code-snippets',snippetController.getUserCodeSnippets.bind(snippetController))

export default codeSnippetRouter