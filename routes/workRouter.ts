import router from './index';
import validateToken from '../middlewares/validateToken';
import asyncWrap from '../utils/utility';
import workController from '../controllers/workController';

// 카테고리별 총 게시물 수 + 최신 feed list
router.get('', asyncWrap.asyncWrap(workController.getWorkList));
router.get('/feed/:id', asyncWrap.asyncWrap(workController.getFeed));
router.get('/:sort', asyncWrap.asyncWrap(workController.getWorkList)); // sort 종류 ('recommendpoint', 'sympathycnt')
router.delete(
  '/feed/:id',
  validateToken.validateToken,
  workController.deletefeed
);

export default router;
