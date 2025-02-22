const searchListService = require('../services/searchListService');

// 검색어 입력시 + 카테고리 설정
const getSearchList = async (req, res) => {
  const { query } = req.query;
  const { category_name } = req.query;
  const queryArr = query.split(' ');
  const result = await searchListService.getSearchList(queryArr, category_name);
  res.status(200).json(result);
};

module.exports = { getSearchList };
