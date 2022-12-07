import { Router } from 'express';
const router = Router();

import asyncWrap from '../utils/utility';
import validateToken from '../middlewares/validateToken';
import commentController from '../controllers/commentController';

router.post(
  '/',
  asyncWrap.asyncWrap(validateToken.validateToken),
  asyncWrap.asyncWrap(commentController.postComment)
);
router.patch(
  '/',
  asyncWrap.asyncWrap(validateToken.validateToken),
  asyncWrap.asyncWrap(commentController.modifiyComment)
);
router.delete(
  '/',
  asyncWrap.asyncWrap(validateToken.validateToken),
  asyncWrap.asyncWrap(commentController.deleteComment)
);

export default router;
