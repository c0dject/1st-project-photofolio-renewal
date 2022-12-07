import { Router } from 'express';
const router = Router();

import asyncWrap from '../utils/utility';
import validateToken from '../middlewares/validateToken';

import upload from '../utils/utility';
import userController from '../controllers/userController';

//회원가입
router.post(
  '/signup',
  upload.upload.single('profile'),
  asyncWrap.asyncWrap(userController.createUser)
);

//로그인
router.post('/login', asyncWrap.asyncWrap(userController.loginUser));
//계정정보조회페이지
router.post(
  '/accountInfo',
  asyncWrap.asyncWrap(validateToken.validateToken),
  asyncWrap.asyncWrap(userController.getAccountInfo)
);

//계정정보수정
router.patch(
  '/accountInfo',
  asyncWrap.asyncWrap(validateToken.validateToken),
  asyncWrap.asyncWrap(userController.modifyAccountInfo)
);
//계정삭제
router.delete(
  '/accountInfo',
  asyncWrap.asyncWrap(validateToken.validateToken),
  asyncWrap.asyncWrap(userController.deleteAccount)
);

export default router;
