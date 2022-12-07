import { Router } from 'express';
const router = Router();

import asyncWrap from '../utils/utility';
import channelController from '../controllers/channelController';

// 최신 feed list
router.get('/:following_id', asyncWrap.asyncWrap(channelController.getChannel));

export default router;
