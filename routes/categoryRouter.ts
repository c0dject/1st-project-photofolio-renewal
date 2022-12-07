import { Router } from 'express';
const router = Router();

import asyncWrap from '../utils/utility';
import categoryController from '../controllers/categoryController';

router.get('/tags', asyncWrap.asyncWrap(categoryController.findTagCount));
router.get(
  '/:categoryName',
  asyncWrap.asyncWrap(categoryController.findCategoryList)
);

export default router;
