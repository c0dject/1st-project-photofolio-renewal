import channelService from '../services/channelService';
import { Request, Response } from 'express';

// channel 내용 출력
const getChannel = async (req: Request<ReqParams>, res: Response) => {
  const user_id = req.user_id;
  const { following_id } = req.params;
  const result = await channelService.getChannel(following_id, user_id);
  res.status(200).json(result);
};

export default { getChannel };
