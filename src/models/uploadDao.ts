import myDataSource from './index';

const worksCategory = async (category_name: string) => {
  const [categoryId] = await myDataSource.query(`
    SELECT id FROM Works_Category WHERE category_name = '${category_name}'
  `);
  return categoryId.id;
};

const publicStatus = async (public_status: string) => {
  const [statusId] = await myDataSource.query(`
    SELECT id FROM public_status WHERE status = '${public_status}'
  `);
  return statusId.id;
};

const findTilte = async (title: string, user_id: number) => {
  return await myDataSource.query(`
  SELECT title FROM Works_Posting WHERE title = '${title}' and user_id = '${user_id}'
`);
};

const uploadForm = async (
  title: string,
  content: string,
  user_id: number,
  category_id: number,
  status_id: number
) => {
  return await myDataSource.query(`
  INSERT INTO Works_Posting (user_id, category_id, title, content, status_id)
  VALUES ('${user_id}', '${category_id}', '${title}', '${content}', '${status_id}')
  `);
};

const worksPosting = async (user_id: number, title: string) => {
  const postingId = await myDataSource.query(`
    SELECT id FROM Works_Posting WHERE user_id = '${user_id}' AND title='${title}'
  `);
  return postingId[0].id;
};

const uploadImages = async (posting_id: number, path: any) => {
  for (let i = 0; i < path.length; i++) {
    await myDataSource.query(`
  INSERT INTO upload_file (posting_id, file_sort_id, upload_url)
  VALUES ('${posting_id}', '1', '${path[i]}')
  `);
  }
};

const worksTagNames = async (arrayTag: string) => {
  for (let i = 0; i < arrayTag.length; i++) {
    await myDataSource.query(`
  INSERT INTO Works_tag_names (name)
  VALUES ('${arrayTag[i]}')
  `);
  }
};

const deleteOverlapTag = async () => {
  return await myDataSource.query(`
    DELETE a FROM Works_tag_names a , Works_tag_names b WHERE a.id > b.id AND a.name = b.name;
  `);
};

const findTagId = async (arrayTag: string) => {
  const tagIdArray = [];
  for (let i = 0; i < arrayTag.length; i++) {
    const [tagId] = await myDataSource.query(`
    SELECT id FROM Works_tag_names WHERE name = '${arrayTag[i]}'
    `);
    tagIdArray.push(tagId.id);
  }
  return tagIdArray;
};

const worksPostingTags = async (tagId: any, posting_id: number) => {
  for (let i = 0; i < tagId.length; i++)
    await myDataSource.query(`
  INSERT INTO Works_Posting_tags (tag_id, posting_id)
  VALUES ('${tagId[i]}', '${posting_id}')
  `);
};

export default {
  worksCategory,
  publicStatus,
  findTilte,
  uploadForm,
  worksPosting,
  worksTagNames,
  deleteOverlapTag,
  uploadImages,
  findTagId,
  worksPostingTags,
};
