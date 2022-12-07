import myDataSource from './index';

const worksCategory = async (category_name: string) => {
  const [categoryId] = await myDataSource.query(`
    SELECT id FROM Works_Category WHERE category_name = '${category_name}'
  `);
  const category_id = categoryId.id;
  return category_id;
};

const publicStatus = async (public_status: string) => {
  const [statusId] = await myDataSource.query(`
    SELECT id FROM public_status WHERE status = '${public_status}'
  `);
  const status_id = statusId.id;
  return status_id;
};

const findTilte = async (title: string, user_id: number) => {
  const tilteName = await myDataSource.query(`
  SELECT title FROM Works_Posting WHERE title = '${title}' and user_id = '${user_id}'
`);
  return tilteName;
};

const uploadForm = async (
  title: string,
  content: string,
  user_id: number,
  category_id: number,
  status_id: number
) => {
  const posting = await myDataSource.query(`
  INSERT INTO Works_Posting (user_id, category_id, title, content, status_id)
  VALUES ('${user_id}', '${category_id}', '${title}', '${content}', '${status_id}')
  `);
  return posting;
};

const worksPosting = async (user_id: number, title: string) => {
  const postingId = await myDataSource.query(`
    SELECT id FROM Works_Posting WHERE user_id = '${user_id}' AND title='${title}'
  `);
  const posting_id = postingId[0].id;
  return posting_id;
};

// FIXME typescript path.length의 오류 잡기
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
  const noOverlapTag = await myDataSource.query(`
    DELETE a FROM Works_tag_names a , Works_tag_names b WHERE a.id > b.id AND a.name = b.name;
  `);
  return noOverlapTag;
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

// FIXME typescript 오류 잡기 - tagID는 배열인데 any가 맞는가?? any로 하면 오류가 난다.
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
