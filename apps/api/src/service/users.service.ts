import { getDB, saveDB, User } from '../database/database';


export const emailExists = (email: string): boolean => {
  const users: User[] = getDB().users;

  return users.some(user => user.email === email);
}

export const saveUser = (user: User): void => {
  const db = getDB();
  const users = db.users;
  users.push(user);

  saveDB(db);
}