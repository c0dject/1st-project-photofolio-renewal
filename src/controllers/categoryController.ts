import categoryService from '../services/categoryService';
import { Request, Response } from 'express';

// tag별 피드 개수
const findTagCount = async (req: Request, res: Response) => {
  const result = await categoryService.findTagCount();
  res.status(200).json({ data: result });
};

// 카테고리별 피드 리스트
const findCategoryList = async (req: Request, res: Response) => {
  const { categoryName } = req.params;
  const result = await categoryService.findCategoryList(categoryName);
  res.status(200).json(result);
};

export default { findTagCount, findCategoryList };
