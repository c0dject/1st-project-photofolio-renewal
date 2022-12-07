import jwt from 'jsonwebtoken';

const validateToken = async (req: Request, res: Response, next: any) => {
  // 인증 완료
  try {
    // 요청 헤더에 저장된 토큰(req.headers.authorization)과 비밀키를 사용하여 토큰을 req.decoded에 반환
    let token = req.headers.authorization;
    if (!token) {
      throw { status: 401, message: `TOKEN IS NOT EXISTS` };
    }
    token = token.includes('Bearer') ? token.replace(/^Bearer\s+/, '') : token;
    // FIXME 닷엔브 대체 왜?!!
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user_id = verifiedToken.id;
    next();
  } catch (error) {
    // 인증 실패
    // 유효시간이 초과된 경우
    const err = error as Error;
    if (err.name === 'TokenExpiredError') {
      // FIXME res.status는 대체 어떻게 type지정을?
      res.status(419).json({
        status: 419,
        message: '토큰이 만료되었습니다.',
      });
    }
    // 토큰의 비밀키가 일치하지 않는 경우
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json({
        status: 401,
        message: '유효하지 않은 토큰입니다.',
      });
    }

    res.status(err.status).json({ message: err.message });
  }
};

export default { validateToken };
