import myDataSource from './index';

const postComment = async (comment: string, id: number, user_id: number) => {
  await myDataSource.query(
    `INSERT Comment SET comment=(?), posting_id=(?), user_id=(?);`,
    [comment, id, user_id]
  );
  const allCommentsAfterModifying = await myDataSource.query(
    `
    SELECT c.id, c.user_id, c.posting_id, u.kor_name, c.comment, SUBSTRING(c.created_at,1,10) as created_at, SUBSTRING(c.updated_at,1,10) as updated_at 
    FROM Comment c
    LEFT JOIN Users u on u.id = c.user_id where posting_id = (?)
    order by c.id asc;
    `,
    [id]
  );
  return allCommentsAfterModifying;
};

const selectComment = async (comment_id: number) => {
  const [selectedComment] = await myDataSource.query(
    `SELECT * FROM Comment where id=(?)`,
    [comment_id]
  );
  return selectedComment;
};

const modifiyComment = async (
  id: number,
  comment: string,
  user_id: number,
  comment_id: number
) => {
  await myDataSource.query(
    `UPDATE Comment SET Comment=(?), user_id=(?), posting_id=(?) WHERE id=(?);`,
    [comment, user_id, id, comment_id]
  );
  const allCommentsAfterModifying = await myDataSource.query(
    `SELECT * FROM Comment where posting_id = (?)
    order by created_at asc;`,
    [id]
  );
  return allCommentsAfterModifying;
};

const deleteComment = async (comment_id: number) => {
  await myDataSource.query(`DELETE FROM Comment where id=(?)`, [comment_id]);
};

export default { postComment, selectComment, modifiyComment, deleteComment };
