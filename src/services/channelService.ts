import channelDao from '../models/channelDao';

const getChannel = async (following_id: number, user_id: number) => {
  return channelDao.getChannel(following_id, user_id);
};

export default { getChannel };
