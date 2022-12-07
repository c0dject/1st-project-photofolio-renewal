import { Router } from 'express';
const router = Router();

import asyncWrap from '../utils/utility';
import validateToken from '../middlewares/validateToken';
import upload from '../utils/utility';
import uploadController from '../controllers/uploadController';

//여러장 사진 업로드
router.post(
  '/form',
  asyncWrap.asyncWrap(validateToken.validateToken),
  upload.upload.array('file', 4),
  asyncWrap.asyncWrap(uploadController.uploadImages)
);

export default router;
