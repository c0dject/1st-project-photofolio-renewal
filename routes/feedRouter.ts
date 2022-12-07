import { Router } from 'express';
const router = Router();

import asyncWrap from '../utils/utility';
import validateToken from '../middlewares/validateToken';
import feedController from '../controllers/feedController';

// 최신 feed list
router.get(
  '/list',
  asyncWrap.asyncWrap(validateToken.validateToken),
  asyncWrap.asyncWrap(feedController.getFeedsList)
);

module.exports = router;
