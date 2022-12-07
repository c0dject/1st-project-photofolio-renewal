import feedDao from '../models/feedDao';

// 최신 feed list
const getFeedsList = async (user_id: number) => {
  return await feedDao.getFeedsList(user_id);
};

export default { getFeedsList };
