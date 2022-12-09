import { Request, Response } from 'express';
import workService from '../services/workService';
import userService from '../services/userService';

// 카테고리별 총 게시물 수 + 최신 feed list
const getWorkList = async (req: Request, res: Response) => {
  const sort: string = req.query.sort as string;
  const result = await workService.getWorkList(sort);
  res.status(200).json(result);
};

// 지정된 피드 상세
const getFeed = async (req: Request<ReqParams>, res: Response) => {
  const { id } = req.params;
  const result = await workService.getFeed(id);
  res.status(200).json(result);
};

const deletefeed = async (req: Request, res: Response) => {
  const user_id = req.user_id;
  const posting_id = req.params.id;
  const REQUIRE_KEYS: any = [user_id, posting_id];

  Object.keys(REQUIRE_KEYS).map(key => {
    if (!REQUIRE_KEYS[key]) {
      throw new Error(`KEY_ERROR: ${key}`);
    }
  });

  const userInfoById = await userService.getAccountInfo(user_id);

  if (user_id !== userInfoById.id) {
    throw new Error(`ONLY WRITER CAN DELETE THE FEED`);
  }

  await workService.deletefeed(posting_id);

  res.status(204).json({ message: 'FEED DELETED' });
};

export default { getWorkList, getFeed, deletefeed };
