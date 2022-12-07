// const { json } = require('express');
import jwt from 'jsonwebtoken';
import userService from '../services/userService';

const createUser = async (req: Request, res: Response) => {
  const {
    login_id,
    password,
    password_check,
    kor_name,
    eng_name,
    nickname,
    email,
  } = req.body;

  const profile_image = req.file.location;

  const REQUIRE_KEYS = [
    login_id,
    password,
    password_check,
    kor_name,
    eng_name,
    nickname,
    email,
  ];

  Object.keys(REQUIRE_KEYS).map(key => {
    if (!REQUIRE_KEYS[key]) {
      throw new Error(`KEY_ERROR: ${key}`);
    }
  });

  await userService.createUser(
    login_id,
    password,
    password_check,
    kor_name,
    eng_name,
    nickname,
    email,
    profile_image
  );

  res.status(201).json({ message: '회원가입 되었습니다.' });
};

const loginUser = async (req: Request, res: Response) => {
  const { login_id, password } = req.body;

  const REQUIRED_KEYS = { login_id, password };
  Object.keys(REQUIRED_KEYS).map(key => {
    if (!REQUIRED_KEYS[key]) {
      const error = new Error(`KEY_ERROR: ${key}`);
      error.statusCode = 400;
      throw error;
    }
  });

  const result = await userService.loginUser(login_id, password);
  const name = result.kor_name;
  const profile = result.profile_image;
  const id = result.id;
  const userEmail = result.email;
  const token = jwt.sign(
    {
      type: 'JWT',
      name: name,
      profile: profile,
      id: id,
      email: userEmail,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: '3000000000000000000m', // 만료시간 30분
      issuer: '토큰발급자',
    }
  );
  res.status(200).json({
    code: 200,
    message: '토큰이 발급되었습니다.',
    token: token,
    id: id,
    name: name,
    profile: profile,
  });
};

const getAccountInfo = async (req: Request, res: Response) => {
  const user_id = req.user_id;
  if (!user_id) {
    const error = new Error('No user_id in req');
    error.status = 404;
    throw error;
  }
  const userInfoById = await userService.getAccountInfo(user_id);
  res.status(200).json({ data: userInfoById });
};

const modifyAccountInfo = async (req, res) => {
  const user_id = req.user_id;
  const { kor_name, eng_name, email, nickname } = req.body;
  const essentialKeys = { kor_name, eng_name, email, nickname };
  if (!user_id) {
    const error = new Error('NO USER_ID IN REQ');
    error.status = 404;
    throw error;
  }
  Object.keys(essentialKeys).map(key => {
    if (!essentialKeys[key]) {
      const error = new Error(`KEY_ERROR : '${key}'`);
      error.status = 400;
      throw error;
    }
  });
  const userdata = await userService.modifyAccountInfo(
    user_id,
    kor_name,
    eng_name,
    email,
    nickname
  );
  res
    .status(200)
    .json({ message: 'USER INFORMATION HAS BEEN MODIFIED', data: userdata });
  console.log(`USER_ID ${user_id}'s INFORMATION HAS BEEN MODIFIED`);
};

const deleteAccount = async (req: Request, res: Response) => {
  const user_id = req.user_id;
  if (!user_id) {
    const error = new Error('NO USER_ID IN REQ');
    error.status = 404;
    throw error;
  }
  await userService.deleteAccount(user_id);
  res.status(200).json({
    message: `USER ${user_id}'s HAS BEEN REMOVED`,
  });
  console.log(`USER ${user_id}'s HAS BEEN REMOVED`);
};

export default {
  createUser,
  loginUser,
  getAccountInfo,
  modifyAccountInfo,
  deleteAccount,
};
