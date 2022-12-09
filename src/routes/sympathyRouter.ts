import { Router } from 'express';
const router = Router();

import { asyncWrap } from '../utils/utility';
import { validateToken } from '../middlewares/validateToken';
import sympathyController from '../controllers/sympathyController';

router.get(
  '/:id',
  asyncWrap(validateToken),
  asyncWrap(sympathyController.findSympathyOfFeedByUser)
);
router.post(
  '',
  asyncWrap(validateToken),
  asyncWrap(sympathyController.createSympathy)
);
router.delete(
  '',
  asyncWrap(validateToken),
  asyncWrap(sympathyController.deleteSympathy)
);

export default router;
