import { Response } from 'express'

export const httpError = (res:Response, message:string, code:number = 403) => {
    res.status(code)
    res.json(message)
}