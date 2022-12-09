import { Router } from 'express';
const router = Router();

import { asyncWrap } from '../utils/utility';
import channelController from '../controllers/channelController';

router.get('/:following_id', asyncWrap(channelController.getChannel));
// 최신 feed list

export default router;
