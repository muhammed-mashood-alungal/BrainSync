import { Request, Response, NextFunction, query } from "express";
import { ICodeSnippetSercvices } from "../../services/interface/ICodeSnippeService";
import { ICodeSnippetController } from "../interface/ICodeSnippetController";
import { HttpStatus } from "../../constants/status.constants";
import { successResponse } from "../../utils/response";
import { HttpResponse } from "../../constants/responseMessage.constants";

export class CodeSnippetController implements ICodeSnippetController{
    constructor(private _codeSnippetServices : ICodeSnippetSercvices) {}


    async saveCodeSnippet(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId  = req.user
            const {codeData} =req.body
            const newCodeData = await this._codeSnippetServices.saveCodeSnippet({...codeData,createdBy : userId})
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK , {newCodeData }))
        } catch (error) {
            next(error)
        }
    }

    async getUserCodeSnippets(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('Server hit')
            const userId = req.user
            const {searchQuery , skip , limit} = req.query
            const {snippets , count} = await this._codeSnippetServices.getUserCodeSnippets(userId , searchQuery as string , skip , limit)
            console.log(snippets , count)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK , {snippets , count}))
        } catch (error) {
            next(error)
        }
    }
}