import { getDB, saveDB, User } from '../database/database';


export const verifyEmail = (email: string): boolean => {
  const users: User[] = getDB()[0].users;

  return users.some(user => user.email === email);
}

export const saveUser = (user: User): void => {
  const db = getDB();
  const users = db[0].users;
  users.push(user);

  saveDB(db);
}