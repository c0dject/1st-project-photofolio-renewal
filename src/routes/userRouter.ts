import { Router } from 'express';
const router = Router();

import { asyncWrap } from '../utils/utility';
import { validateToken } from '../middlewares/validateToken';

import { upload } from '../utils/utility';
import userController from '../controllers/userController';

//회원가입
router.post(
  '/signup',
  upload.single('profile'),
  asyncWrap(userController.createUser)
);

//로그인
router.post('/login', asyncWrap(userController.loginUser));
//계정정보조회페이지
router.post(
  '/accountInfo',
  asyncWrap(validateToken),
  asyncWrap(userController.getAccountInfo)
);

//계정정보수정
router.patch(
  '/accountInfo',
  asyncWrap(validateToken),
  asyncWrap(userController.modifyAccountInfo)
);
//계정삭제
router.delete(
  '/accountInfo',
  asyncWrap(validateToken),
  asyncWrap(userController.deleteAccount)
);

export default router;
