import searchListService from '../services/searchListService';
import { Request, Response } from 'express';

// 검색어 입력시 + 카테고리 설정
const getSearchList = async (req: Request<ReqQuery>, res: Response) => {
  const query = req.query;
  const { category_name } = req.query;
  // FIXME TS ERROR
  const queryArr = query.split(' ');
  const result = await searchListService.getSearchList(queryArr, category_name);
  res.status(200).json(result);
};

export default { getSearchList };
