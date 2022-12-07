import sympathyService from '../services/sympathyService';

const catchKeyError = (REQUIRE_KEYS: any) => {
  Object.keys(REQUIRE_KEYS).map(key => {
    if (!REQUIRE_KEYS[key]) {
      throw new Error(`KEY_ERROR: ${key}`);
    }
  });
};

// feed상세에서 로그인유저의 공감여부 확인
const findSympathyOfFeedByUser = async (req: Request, res: Response) => {
  let user_id = req.user_id;
  const posting_id = req.params.id;

  const result = await sympathyService.findSympathyOfFeedByUser(
    posting_id,
    user_id
  );
  res.status(200).json(result);
};

// 공감
const createSympathy = async (req: Request, res: Response) => {
  const { posting_id, sympathy_id } = req.body;
  let user_id = req.user_id;

  const REQUIRE_KEYS = { posting_id, sympathy_id };
  catchKeyError(REQUIRE_KEYS);

  const result = await sympathyService.createSympathy(
    posting_id,
    user_id,
    sympathy_id
  );
  res.status(200).json(result);
};

// 공감 취소
const deleteSympathy = async (req: Request, res: Response) => {
  const { posting_id } = req.body;
  let user_id = req.user_id;

  const REQUIRE_KEYS = { posting_id };
  catchKeyError(REQUIRE_KEYS);

  const result = await sympathyService.deleteSympathy(posting_id, user_id);
  res.status(200).json(result);
};

export default { findSympathyOfFeedByUser, createSympathy, deleteSympathy };
