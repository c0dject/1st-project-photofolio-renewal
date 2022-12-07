import util from '../utils/utility';
import uploadService from '../services/uploadService';
import jwt from 'jsonwebtoken';

//게시글 사진 업로드
const uploadImages = async (req: Request, res: Response) => {
  const image = req.files;
  const path = image.map(img => img.location);
  const { title, content, tag, category_name, public_status } = req.body;
  const arrayTag = tag.split(',');
  const verifiedToken = jwt.verify(
    // FIXME 이건 또 왜 닷엔브는 괜찮고 author가 오류??
    req.headers.authorization,
    process.env.SECRET_KEY
  );
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
