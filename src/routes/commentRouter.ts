import { Router } from 'express';
const router = Router();

import { asyncWrap } from '../utils/utility';
import { validateToken } from '../middlewares/validateToken';
import commentController from '../controllers/commentController';

router.post(
  '/',
  asyncWrap(validateToken),
  asyncWrap(commentController.postComment)
);
router.patch(
  '/',
  asyncWrap(validateToken),
  asyncWrap(commentController.modifyComment)
);
router.delete(
  '/',
  asyncWrap(validateToken),
  asyncWrap(commentController.deleteComment)
);

export default router;
