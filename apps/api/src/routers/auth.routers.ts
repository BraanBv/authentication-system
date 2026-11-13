import { Router } from 'express';
import { registerController } from '../controller/auth.controller';

const app: Router = Router();

app.post('/register', registerController);


export default app;
