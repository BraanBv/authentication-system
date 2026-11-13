import { Request, Response, NextFunction, Router } from 'express';
import { loginController, refreshTokenController, registerController } from '../controller/auth.controller';

const app: Router = Router();

app.use((req: Request, res: Response, next: NextFunction) => {
  res.set({
    'WWW-Authenticate': 'Bearer',
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache'
  });
});

app.post('/register', registerController);
app.post('/login', loginController);
app.post('/refresh', refreshTokenController);


export default app;
