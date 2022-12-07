import { Router } from 'express';
const router = Router();

import asyncWrap from '../utils/utility';
import searchListController from '../controllers/searchListController';

// 검색어 입력시 + 카테고리 설정
router.get('', asyncWrap.asyncWrap(searchListController.getSearchList));

module.exports = router;
