import crypto from 'crypto';
import { Request, Response } from 'express';
import { saveUser, verifyEmail } from '../service/users.service';
import { hashPassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { saveRefreshToken } from '../service/jwt.service';

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

  if(verifyEmail(body.email)) return res.status(409).json({
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