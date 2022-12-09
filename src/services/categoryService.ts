import categoryDao from '../models/categoryDao';

// tag별 피드 개수
const findTagCount = async () => {
  return await categoryDao.findTagCount();
};

// 카테고리별 피드 리스트
const findCategoryList = async (categoryName: string) => {
  const findCategoryName = await categoryDao.findCategoryName(categoryName);
  if (!findCategoryName.check_categoryName) {
    throw { status: 400, message: `DO NOT EXISTS CATEGORY NAME` };
  } else {
    return await categoryDao.findCategoryList(categoryName);
  }
};

export default { findTagCount, findCategoryList };
