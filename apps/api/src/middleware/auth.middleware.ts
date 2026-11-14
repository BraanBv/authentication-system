import { Request, Response, NextFunction } from 'express';
import { AccessTokenPayload, verifyAccessToken } from '../utils/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader: string | undefined = req.headers['authorization'];
  const token: string | undefined = authHeader && authHeader.split(' ')[1];

  if(!token) return res.status(401).json({
    error: 'missing_token',
    message: 'Authentication required.',
  });

  try {
    const decode: AccessTokenPayload = verifyAccessToken(token);
    req.user = decode;

    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'invalid_token',
      message: 'You do not have a permission to access this resource.',
    });
  }
}