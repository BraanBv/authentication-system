import express, { Application, Request, Response } from 'express';
import { logger } from './utils/console.js';
import dotenv from 'dotenv';
import path from 'node:path';
import cors from 'cors';

dotenv.config({
  path: path.join(__dirname, '..', '..', '..', '.env'),
})

const app: Application = express();
const PORT = process.env.PORT_API;
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, () => {
  logger.success('Serve Up!');
  logger.info(`PORT: ${PORT}`);
});