import { NextFunction, Request, Response, } from "express";
import { verifyJwt } from '../utils/handleJwt'
import { httpError } from "../utils/httpError";

export function checkTokenStrict(req: any, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return httpError(res, 'Not token', 403)
    }

    try {
        const decoded = verifyJwt(token)
        if (decoded){
            req.user = decoded; // Aquí agregamos el payload decodificado a la solicitud
            next();
        }else{
            return httpError(res, 'Token not valid', 403);
        }
    } catch (err) {
        return httpError(res, 'Token not valid', 403);
    }
}

export function checkToken(req: any, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return next()
    
    const decoded = verifyJwt(token)
    req.user = decoded; // agregamos el payload decodificado a la solicitud
    next()
} 
