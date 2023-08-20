import { Router } from 'express';
import {
  getAllLocals,
  getLocal,
  updateLocal,
  deleteLocal,
  postLocal,
  createTableLocal,
  getRecents,
  putSchedules,
  putLinks,
  putLocal
} from '../controllers/locals';
import { checkToken, checkTokenStrict } from '../middleware/checkToken';

export const router = Router();

router.get('/get-all', getAllLocals);

router.get('/:local?', checkToken, getLocal);

router.post('/get-recents', getRecents);

router.post('/post-one', postLocal);

router.post('/post-table', createTableLocal);

router.delete('/delete-one/:id', deleteLocal);

router.put('/put-one',checkTokenStrict, updateLocal);

router.put('/put-schedules',checkTokenStrict, putSchedules);
router.put('/put-links',checkTokenStrict, putLinks);
router.put('/',checkTokenStrict, putLocal);

