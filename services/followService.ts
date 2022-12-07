import followDao from '../models/followDao';
import exp from 'constants';

// 상세피드에서 팔로우 체결유무 확인
const getFollowResult = async (id: number, user_id: number) => {
  return await followDao.getFollowResult(id, user_id);
};

// 팔로우 체결
const createFollow = async (following_id: number, user_id: number) => {
  const followCheck = await followDao.isFollow(following_id, user_id);
  if (followCheck.follow_check === true) {
    throw { status: 400, message: 'ALREADY FOLLOWED' };
  }
  return await followDao.createFollow(following_id, user_id);
};

// 팔로우 체결
const deleteFollow = async (following_id: number, user_id: number) => {
  return await followDao.deleteFollow(following_id, user_id);
};

export default { getFollowResult, createFollow, deleteFollow };
