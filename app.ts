import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
import multer from 'multer';
import morgan from 'morgan';
// FIXME 모듈이란...
import utility from './utils/utility';

let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
const createApp = () => {
  const app: Express = express();
  app.use(cors(corsOptions));
  // @ts-ignore
  app.use(morgan(utility.morganCustomFormat()));

  app.use(express.json());
  app.use(router);

  app.use(multer);

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const { status, message } = err;
    console.error(err);
    res.status(status || 500).json({ message });
  });

  return app;
};

export default { createApp };
