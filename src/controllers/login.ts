import { Router, Request, Response } from "express";
import * as bcrypt from 'bcrypt'
import { doQuery } from "../mysql/config";
import { httpError } from "../utils/httpError";
import { Admin } from "../interface/admin";
import { cleanUser } from "../utils/cleanUser";
import { signJwt, verifyJwt } from "../utils/handleJwt";
import { checkData } from "../utils/checkData";
import { sendEmail } from "../config/nodemailer";
import { resetPasswordTemplate } from "../templates/resetPasswordEmail";
import { formatExpiration } from "../utils/formatExpJwt";
import { JwtPayload } from "jsonwebtoken";


export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        let user = await doQuery(`select * from users WHERE username = ?`, [username])

        if (checkData(user)) {
            return httpError(res, 'No existe un usuario registrado', 401)
        }

        const checkPassword = await bcrypt.compare(password, user[0].password)


        if (!checkPassword) {
            return httpError(res, 'Contraseña incorrecta', 401)
        }

        if (!user[0].admin) {
            user = cleanUser(user[0]) 
        }


        delete user[0].password
        const token = signJwt(user[0])
        const exp = (verifyJwt(token) as JwtPayload).exp
        
        res.cookie('jwt', token, {httpOnly:true, secure:true}).json({token, exp})
        

    } catch (err) {
        console.log(err);
        httpError(res, 'A ocurrido un error intente nuevamente', 403)
    }

}

export const register = async (req: Request, res: Response) => {

    try {
        const user:Admin = (req as any).user
        
        if (!user.root) {
            return httpError(res, 'No tienes permisos', 403)
        }
        
        let { username, password, admin, admin_table, local_id } = req.body

        const salt = await bcrypt.genSalt(15)
        password = await bcrypt.hash(password, salt)

        const op = await doQuery(`
        INSERT IGNORE INTO users (username, password, admin_table, local_id, admin)
        VALUES (?,?,?,?,?);`,
        [username, password, admin_table, local_id, admin || 0])

        if (!op.affectedRows) return httpError(res, 'Nombre de usuario en uso', 403)

        res.status(201).json({ success: 'Usuario creado' })
    } catch (err) {
        console.log(err);
        httpError(res, 'A ocurrido error', 403)

    }
}


export const registerAdmin = async (req: Request, res: Response) => {

    try {
        const data = req.body as Admin

        const salt = await bcrypt.genSalt(15)
        data.password = await bcrypt.hash(data.password, salt)
        const operation = await doQuery(`INSERT INTO users (username, password, admin_table, local_id) VALUES (?,?,?,?)`, [data.username, data.password, data.admin_table, data.local_id])

        res.status(201).json(operation)

    } catch (err) {
        console.log(err);
        httpError(res, 'ERROR_REGISTER_ADMIN', 403)

    }

}

export const sendEmailToResetPassword = async (req: Request, res: Response) => {

    try {
        //HACER TOKEN Y TODA LA BOLA 
        const {email} = req.body

        const user:Admin[] = await doQuery(`select * from users WHERE email = ?`, [email])

        if (!user[0]) {
            return httpError(res, 'El correo ingresado no esta registrado', 401)
        }

        const token = signJwt({id:user[0].id}, '20m')
        console.log({this:token});
        
        // sendEmail(email, token, resetPasswordTemplate(user[0], token) )

        res.json(true)
    } catch (err) {
        console.log(err);
        httpError(res, 'ERROR_RECOVERY_PASSWORD', 403)

    }

}

export const verifyToken = async (req: Request, res: Response) => {

    try {

        const token = req.query.token as string
        
        const isValid:any = verifyJwt(token)
        
        console.log(formatExpiration(isValid?.exp));

        if (!isValid) {
            httpError(res, 'El link no es valido o expiró porfavor repita el proceso')
            return 
        }

        res.json(true)
    } catch (err) {
        console.log(err);
        httpError(res, 'ERROR_EN_VERIFY_TOKEN', 403)

    }

}

export const resetPassword = async (req: Request, res: Response) => {

    try {

        let password:string = req.body.password
        const token = req.headers.authorization!.split(' ')[1]

        if (!token) {
            httpError(res, 'A ocurrido un error porfavor repita el proceso')
            return
        }

        const userId = (verifyJwt(token) as any).id
        if (!userId) {
            httpError(res, 'El enlace no es valido o expiró porfavor repita el proceso')
            return
        }

        console.log(userId);
        const salt = await bcrypt.genSalt(15)
        password = await bcrypt.hash(password, salt)
        
        const op = await doQuery(`UPDATE users SET password = ? WHERE id = ?;`, [password, userId])
        
        console.log(op);
        

        res.json(true)
    } catch (err) {
        console.log(err);
        httpError(res, 'ERROR_EN_VERIFY_TOKEN', 403)

    }

}