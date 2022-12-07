import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

import { yellow, red, blue, green } from 'cli-color';

aws.config.loadFromPath(__dirname + '/../config/s3.json');

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3 as any,
    bucket: 'photofolio-renewal',
    acl: 'public-read',
    key: function (req, file, cb) {
      // console.log(file),
      cb(null, Date.now() + '.' + file.originalname.split('.').pop()); // 이름 설정
    },
  }),
});

const util = {
  success: (status: number, message: string, data: any) => {
    return {
      status: status,
      success: true,
      message: message,
      data: data,
    };
  },
  fail: (status: number, message: string) => {
    return {
      status: status,
      success: false,
      message: message,
    };
  },
};

function asyncWrap(asyncController: any) {
  return async (req: Request, res: Response, next: any) => {
    try {
      await asyncController(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

function bodyText(req: Request) {
  let bodyText = '';
  if (req.method !== 'GET') {
    bodyText = `${yellow('BODY\t|')}`;
    bodyText +=
      Object.keys((req.body as any) || null)
        .map((key, index) => {
          return `${index === 0 ? '' : '\t' + yellow('|')} ${green.italic(
            key
            // FIXME req.body가 변수일때 ts 오류
          )} ${req.body[key]}`;
        })
        .join('\n') + '\n';
  }
  return bodyText;
}

function morganCustomFormat(tokens: any, req: Request, res: Response) {
  return [
    `\n= ${red('MESSAGE')} =`,
    '\n',
    `${blue('URL\t| ')}`,
    tokens.url(req, res),
    '\n',
    `${blue('METHOD\t| ')}`,
    tokens.method(req, res),
    '\n',
    bodyText(req),
    `${blue('STATUS\t| ')}`,
    tokens.status(req, res),
    '\n',
    `${blue('RESP\t| ')}`,
    tokens['response-time'](req, res),
    'ms',
    `${blue('\nDATE\t|')} `,
    new Date().toLocaleTimeString(),
    '\n',
  ].join('');
}

function errorHandler(err: any, _1: any, res: Response, _2: any) {
  // 흐름상 에러가 검출되면 로그 표시 및 클라이언트에게 전달
  let responseInfo = err;
  if (err.sqlMessage) {
    console.log(err.sqlMessage);
    responseInfo = { message: 'failed', status: 500, ...err };
  }
  console.log(`${red('ERR\t|')}`, err);
  res
    .status(responseInfo.status || 500)
    .json({ message: responseInfo.message || '' });
}

export default {
  morganCustomFormat,
  asyncWrap,
  errorHandler,
  util,
  upload,
};
