import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = (data: string): string => {
  return bcrypt.hashSync(data, SALT_ROUNDS);
}

export const comparePassword = (data: string, hash: string): boolean => {
  return bcrypt.compareSync(data, hash);
}