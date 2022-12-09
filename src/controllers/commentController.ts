import commentService from '../services/commentService';
import { Request, Response } from 'express';

const postComment = async (req: Request, res: Response) => {
  const user_id = req.user_id;
  // user_id = 작성자의 id
  const { id, comment } = req.body;
  // id = 게시물의 id
  if (!comment) {
    //댓글 내용이 없을 경우 에러 발생
    const error = new Error('COMMENT TEXT NEEDED');
    error.status = 404;
    throw error;
  }
  // 게시물id가 없을 경우 에러 발생
  if (!id) {
    const error = new Error('VALID POSTING ID NEEDED');
    error.status = 404;
    throw error;
  }
  const postedComment = await commentService.postComment(comment, id, user_id);
  res.status(201).json({ data: postedComment });
};

const modifyComment = async (req: Request, res: Response) => {
  const user_id = req.user_id;
  //user_id = 작성자의 id
  const { comment, id, comment_id } = req.body;
  //id = 게시물의 id
  //comment_id = 댓글의 id
  const modifiedComment = await commentService.modifiyComment(
    id,
    comment,
    user_id,
    comment_id
  );
  res.status(200).json({
    data: modifiedComment,
  });
  console.log('COMMENT MODIFIED');
};

const deleteComment = async (req: Request, res: Response) => {
  const user_id = req.user_id;
  const { comment_id, posting_id } = req.body;
  await commentService.deleteComment(user_id, comment_id);
  res.status(204).json({ message: null });
};

export default { postComment, modifyComment, deleteComment };
