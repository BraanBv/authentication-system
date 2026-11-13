import fs from 'fs';
import path from 'path';
import { logger } from '../utils/console';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface DB {
  users: User;
  refreshTokens: string[];
}

const DB_PATH = path.join(__dirname, '..', 'database', 'database.json');
const INITIAL_CONTENT = [{
  users: [],
  refreshTokens: []
}];

export const getDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if(error.code === 'ENOENT') {
      logger.warn('DB does not exist.');

      fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_CONTENT), 'utf-8');
      logger.success('DB created.')

      return INITIAL_CONTENT;
    } else {
      throw error;
    }
  }
}

export const saveDB = (data: DB): void => {
  try {
    const db = JSON.stringify(data, null, 2);
    fs.writeFileSync(DB_PATH, db);
  } catch (error) {
    console.error('Error: ', error);
  }
}