import { Router } from 'express';
const router = Router();

import asyncWrap from '../utils/utility';
import validateToken from '../middlewares/validateToken';
import sympathyController from '../controllers/sympathyController';

router.get(
  '/:id',
  asyncWrap.asyncWrap(validateToken.validateToken),
  asyncWrap.asyncWrap(sympathyController.findSympathyOfFeedByUser)
);
router.post(
  '',
  asyncWrap.asyncWrap(validateToken.validateToken),
  asyncWrap.asyncWrap(sympathyController.createSympathy)
);
router.delete(
  '',
  asyncWrap.asyncWrap(validateToken.validateToken),
  asyncWrap.asyncWrap(sympathyController.deleteSympathy)
);

export default router;
