import { Router } from 'express';
const router = Router();

import asyncWrap from '../utils/utility';
import validateToken from '../middlewares/validateToken';
import followController from '../controllers/followController';

// getFollow (팔로우 여부 확인)
router.post(
  '/check',
  asyncWrap.asyncWrap(validateToken.validateToken),
  asyncWrap.asyncWrap(followController.getFollowResult)
);

router.post(
  '',
  asyncWrap.asyncWrap(validateToken.validateToken),
  asyncWrap.asyncWrap(followController.createFollow)
);
router.delete(
  '',
  asyncWrap.asyncWrap(validateToken.validateToken),
  asyncWrap.asyncWrap(followController.deleteFollow)
);

export default router;
