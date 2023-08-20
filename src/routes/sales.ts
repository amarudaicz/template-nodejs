import Router, { Request, Response } from 'express'
import { getSales, postSale } from '../controllers/sales'
import { checkTokenStrict } from '../middleware/checkToken'

 const router = Router()


router.get('/', checkTokenStrict, getSales)
router.post('/', postSale)

export {router}

