import jwt from 'jsonwebtoken'

export const signJwt = (payload: any, expires:string = '28d') => {
    return jwt.sign(payload, process.env.SECRET_JWT!, { expiresIn:expires })
}

export const verifyJwt = (token: string) => {
    try {
        return jwt.verify(token, process.env.SECRET_JWT!)
    } catch (err) {
        return null
    }
}
