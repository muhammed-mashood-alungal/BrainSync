import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { NoteRepository } from "../repositories/implementation/notes.repository";
import { NoteService } from "../services/implementation/note.services";
import { NoteController } from "../controllers/implementation/note.controller";
import { SessionRepository } from "../repositories/implementation/session.repository";


const noteRouter = Router()

const noteRepo = new NoteRepository()
const sessionRepo = new SessionRepository()
const noteServices = new NoteService(noteRepo, sessionRepo)
const noteController = new NoteController(noteServices)

noteRouter.post('/write/:roomId/:userId', authMiddleware, noteController.writeNote.bind(noteController))
noteRouter.post('/save/:sessionCode', authMiddleware, noteController.saveNote.bind(noteController))
noteRouter.get('/pdf/:fileId', authMiddleware, noteController.getNotePdf.bind(noteController))
noteRouter.get('/initial-content/:sessionCode' , authMiddleware , noteController.getInitialContent.bind(noteController))
noteRouter.get('/my-notes', authMiddleware  ,noteController.myNotes.bind(noteController))

export default noteRouter
