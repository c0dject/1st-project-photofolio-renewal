import { Router } from 'express';
const router = Router();

import { asyncWrap } from '../utils/utility';
import { validateToken } from '../middlewares/validateToken';
import { upload } from '../utils/utility';
import uploadController from '../controllers/uploadController';

//여러장 사진 업로드
router.post(
  '/form',
  asyncWrap(validateToken),
  upload.array('file', 4),
  asyncWrap(uploadController.uploadImages)
);

export default router;
