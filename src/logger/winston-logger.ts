import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'node:path';
import * as fs from 'node:fs';

// اطمینان از وجود پوشه لاگ‌ها
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// فرمت برای کنسول (رنگی و خوانا)
const consoleFormat = printf(({ level, message, timestamp, context, trace }) => {
  const ctx = context ? ` [${String(context)}]` : '';
  const stack = trace ? `\n${String(trace)}` : '';
  return `${String(timestamp)} ${level}${ctx}: ${String(message)}${stack}`;
});

// فرمت برای فایل (JSON)
const fileFormat = combine(timestamp(), errors({ stack: true }), json());

export const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
  ),
  defaultMeta: { service: 'resume-api' },
  transports: [
    // کنسول
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        consoleFormat,
      ),
    }),

    // فایل روزانه - خطاها
    new winston.transports.DailyRotateFile({
      dirname: logDir,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
      format: fileFormat,
    }),

    // فایل روزانه - همه لاگ‌ها
    new winston.transports.DailyRotateFile({
      dirname: logDir,
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: fileFormat,
    }),
  ],
  exitOnError: false,
});