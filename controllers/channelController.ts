import channelService from '../services/channelService';

// channel 내용 출력
const getChannel = async (req: Request, res: Response) => {
  const user_id = req.user_id;
  // FIXME params.id는 type을 어떻게 지정하나?
  const { following_id } = req.params;
  const result = await channelService.getChannel(following_id, user_id);
  res.status(200).json(result);
};

export default { getChannel };
