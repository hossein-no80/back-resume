import { Request } from 'express';

export default class userGuard {
  id: number;
  email: string;
}

export interface RequestWithUser extends Request {
  user: userGuard;
}
