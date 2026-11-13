import { getDB, saveDB } from "../database/database";


export const saveRefreshToken = (refreshToken: string): void => {
  const db = getDB();
  const refreshTokens = db[0].refreshTokens;

  refreshTokens.push(refreshToken);
  saveDB(db);
}