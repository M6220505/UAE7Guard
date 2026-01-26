import { User } from '@db/schema';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      isAuthenticated?: () => boolean;
    }
  }
}

export {};
