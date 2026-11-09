import { styleText } from 'node:util';

export const logger: Logger = {
  success: (text: string) => console.log(styleText('green', text)),
  info: (text: string) => console.log(styleText('yellow', text)),
  warn: (text: string) => console.log(styleText('red', text)),
  error: (text: string) => console.log(styleText('red', text)),
};

interface Logger {
  success: (text: string) => void;
  info: (text: string) => void;
  warn: (text: string) => void;
  error: (text: string) => void;
}