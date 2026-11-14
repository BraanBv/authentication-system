import { Request, Response } from 'express';
import { User } from '../database/database';
import { getUserByEmail } from '../service/users.service';

export const profileController = (req: Request, res: Response) => {
  const { email } = req.user as { email: string };
  const userData: User = getUserByEmail(email) as User;
  const hour: number = new Date().getHours();
  const greet: string = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : hour < 22 ? 'Buenas noches' : 'Hola';

  res.status(200).json({
    message: greet,
    user: {
      id: userData.id,
      email: userData.email,
      username: userData.username,
    }
  });
}