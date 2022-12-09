import searchListDao from '../models/searchListDao';

// 검색어 입력시 + 카테고리 설정
const getSearchList = async (query: string, category_name: number) => {
  const queryArr = (query: string) => {
    let result = `   
       (wp.title LIKE '%${query[0]}%'
            OR wp.content LIKE '%${query[0]}%')
      `;
    for (let i = 1; i < query.length; i++) {
      let searchQuery = `
         (wp.title LIKE '%${query[i]}%' 
              OR wp.content LIKE '%${query[i]}%')
        `;
      result += `AND ${searchQuery}`;
    }
    return result;
  };

  const changeDao = category_name
    ? await searchListDao.getSearchListWithCategory(
        queryArr(query),
        category_name
      )
    : await searchListDao.getSearchList(queryArr(query));
  return await changeDao;
};

export default { getSearchList };
