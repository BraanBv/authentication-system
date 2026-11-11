import { JwtPayload } from 'jsonwebtoken';
import { AccessTokenPayload, RefreshTokenPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & AccessTokenPayload | RefreshTokenPayload;
    }
  }
}