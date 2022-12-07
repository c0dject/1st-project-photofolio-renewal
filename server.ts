import dotenv from 'dotenv';
import createApp from './app';

dotenv.config();

const startServer = async () => {
  // FIXME 어떻게 해야 사라지나?
  const app = createApp.createApp();
  const port = process.env.PORT;

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
};

startServer();
