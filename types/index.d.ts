interface Error {
  status: number;
  message: string;
  name: string;
}

interface Headers {
  sort: string;
  authorization?: string;
}

interface Request {
  user_id: number;
  params: number;
  query: string;
  files: any;
}

interface Response {
  status: number;
}
interface params {
  id: number;
  following_id: number;
}

// interface ProcessEnv {
//   PORT?: string | number;
//   TYPEORM_CONNECTION?: string;
//   TYPEORM_HOST?: number;
//   TYPEORM_USERNAME?: string;
//   TYPEORM_PASSWORD?: number | string;
//   TYPEORM_DATABASE?: string;
//   TYPEORM_PORT?: number | string;
//   TYPEORM_LOGGING?: boolean;
//   SECRET_KEY?: string;
// }
