import type express from 'express';
import jwt from 'jsonwebtoken';
import { util } from '../utils/utility';
import uploadService from '../services/uploadService';

//게시글 사진 업로드
const uploadImages = async (
  ...[req, res]: Parameters<express.RequestHandler>
) => {
  const image: any = req.files;
  const path = image.map((img: { location: any }) => img.location);
  const { title, content, tag, category_name, public_status } = req.body;
  const arrayTag = tag.split(',');
  let token = req.headers.authorization;
  // FIXME 저 자리의 token만 오류가 뜨는 이유는?
  let verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
  const user_id = verifiedToken.id;
  req.user_id = user_id;

  await uploadService.uploadImages(
    title,
    content,
    arrayTag,
    image,
    category_name,
    user_id,
    public_status
  );
  res.status(200).send(util.success(200, '업로드 성공', path));
};

export default { uploadImages };
