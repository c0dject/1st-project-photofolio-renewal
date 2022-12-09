import feedService from '../services/feedService';
import { Request, Response } from 'express';

// 최신 feed list
const getFeedsList = async (req: Request, res: Response) => {
  let user_id = req.user_id;
  const result = await feedService.getFeedsList(user_id);
  res.status(200).json(result);
};

export default { getFeedsList };
