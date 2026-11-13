import crypto from 'crypto';
import { Request, Response } from 'express';
import { saveUser, emailExists, getUserByEmail } from '../service/users.service';
import { comparePassword, hashPassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, RefreshTokenPayload, verifyRefreshToken } from '../utils/jwt';
import { refreshTokenExists, saveRefreshToken } from '../service/jwt.service';
import { User } from '../database/database';

export const registerController = (req: Request, res: Response) => {
  const body = req.body;

  const detailsError = [];
  if(!body.username) detailsError.push({
    field: 'username',
    issue: 'required',
    message: 'The \'username\' field is required.',
  });

  if(!body.email) detailsError.push({
    field: 'email',
    issue: 'required',
    message: 'The \'email\' field is required.',
  });

  if(!body.password) detailsError.push({
    field: 'password',
    issue: 'required',
    message: 'The \'password\' field is required.',
  });

  if(detailsError.length > 0) return res.status(400).json({
    error: 'validation_error',
    message: 'The request body is invalid.',
    details: detailsError,
  });

  if(emailExists(body.email)) return res.status(409).json({
    error: 'email_already_exists',
    message: 'The \'email\' filed already in use.',
    details: [
      {
        field: 'email',
        issue: 'already_exists',
        message: 'An account with is email already exists.',
      }
    ]
  });

  const id: string = crypto.randomUUID();
  const date: string = new Date().toISOString();
  const passwordHash: string = hashPassword(body.password);

  saveUser({
    id: id,
    username: body.username,
    email: body.email,
    passwordHash: passwordHash,
    createdAt: date
  });

  const refreshToken: string = generateRefreshToken({ 
    sub: id,
    email: body.email,
    jti: crypto.randomBytes(16).toString('hex'),
  });
  saveRefreshToken(refreshToken);

  const accessToken: string = generateAccessToken({
    email: body.email,
    sub: id,
  });

  res.status(201).json({
    user: {
      id: id,
      username: body.username,
      email: body.email,
      created_at: date,
    },
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'Bearer',
  });
};

export const loginController = (req: Request, res: Response) => {
  const body = req.body;

  const detailsError = [];
  if(!body.email) detailsError.push({
    field: 'email',
    issue: 'required',
    message: 'The \'email\' field is required.',
  });

  if(!body.password) detailsError.push({
    field: 'password',
    issue: 'required',
    message: 'The \'password\' field is required.',
  });

  if(detailsError.length > 0) return res.status(400).json({
    error: 'validation_error',
    message: 'The request body is invalid.',
    details: detailsError,
  });

  const user: User | undefined = getUserByEmail(body.email);
  if(user === undefined) return res.status(401).json({
      error: 'invalid_credentials',
      message: 'Invalid email or password'
    });

  
  if(!comparePassword(body.password, user.passwordHash)) return res.status(401).json({
      error: 'invalid_credentials',
      message: 'Invalid email or password'
    });


  const refreshToken: string = generateRefreshToken({ 
    sub: user.id,
    email: user.email,
    jti: crypto.randomBytes(16).toString('hex'),
  });
  saveRefreshToken(refreshToken);

  const accessToken: string = generateAccessToken({
    email: body.email,
    sub: user.id,
  });

  res.status(200).json({
    user: {
      id: user.id,
      username: body.username,
      email: body.email,
    },
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'Bearer',
  });
}

export const refreshTokenController = (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if(!refreshToken) res.status(401).json({
    error: 'missing_refresh_token',
    message: 'The refresh token is required.',
  });

  if(!refreshTokenExists(refreshToken)) res.status(401).json({
    error: 'invalid_refresh_token',
    message: 'The refresh token is invalid or has expired.'
  }); 

  const decodeToken: RefreshTokenPayload = verifyRefreshToken(refreshToken);
  const accessToken: string = generateAccessToken({ sub: decodeToken.sub, email: decodeToken.email });
  res.status(200).json({
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'Bearer'
  });
}