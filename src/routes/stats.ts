import { Router } from 'express';
import { checkTokenStrict } from '../middleware/checkToken';
import { getStats, postView } from '../controllers/stats';

const router = Router();



router.get('/', checkTokenStrict, getStats)
router.post('/', postView)




export { router };