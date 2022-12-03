const workDao = require('../models/workDao');

// 상세페드에서 팔로우 체결유무 확인
const followCheck = async (id, user_id) => {
  return await workDao.followCheck(id, user_id);
};

// 카테고리별 총 게시물 수 + 최신 feed list
const worksList = async sort => {
  // sort 종류 ('recommendpoint', 'sympathycnt')
  const defaultOrder = 'ORDER BY wp.created_at DESC';
  const addSelect = `CONCAT(b.sympathy_cnt + a.comment_cnt) recommendpoint,`;
  const isSelect = sort ? addSelect : '';
  const sortOfOrder = sort ? `ORDER BY ${sort} DESC` : defaultOrder;
  return await workDao.worksList(isSelect, sortOfOrder);
};

// 지정된 피드 상세
const feed = async id => {
  return await workDao.feed(id);
};

module.exports = {
  followCheck,
  worksList,
  feed,
};
