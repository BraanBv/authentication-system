import { Router } from 'express';
import { loginController, refreshTokenController, registerController } from '../controller/auth.controller';

const app: Router = Router();

app.post('/register', registerController);
app.post('/login', loginController);
app.post('/refresh', refreshTokenController);


export default app;
