import { Router } from 'express';
const router = Router();

import { errorHandler } from '../utils/utility';

import userRouter from './userRouter';
import categoryRouter from './categoryRouter';
import feedRouter from './feedRouter';
import workRouter from './workRouter';
import searchListRouter from './searchListRouter';
import sympathyRouter from './sympathyRouter';
import followRouter from './followRouter';
import channelRouter from './channelRouter';
import commentRouter from './commentRouter';

import uploadRouter from './uploadRouter';

router.use('/user', userRouter);
router.use('/works', workRouter);
router.use('/feeds', feedRouter);
router.use('/category', categoryRouter);
router.use('/searchlist', searchListRouter);
router.use('/upload', uploadRouter);
router.use('/sympathy', sympathyRouter);
router.use('/follow', followRouter);
router.use('/channel', channelRouter);
router.use('/comments', commentRouter);

router.use(errorHandler);

export default router;
