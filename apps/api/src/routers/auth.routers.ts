import { Router } from 'express';
import { loginController, registerController } from '../controller/auth.controller';

const app: Router = Router();

app.post('/register', registerController);
app.post('/login', loginController);


export default app;
