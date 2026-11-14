import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { profileController } from '../controller/users.controller';

const app: Router = Router();

app.get('/profile', authMiddleware, profileController);;

export default app;