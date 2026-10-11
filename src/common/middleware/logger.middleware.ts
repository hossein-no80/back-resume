import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // لاگ درخواست
    this.logger.log(`➡️  ${method} ${originalUrl} - ${userAgent} ${ip}`);

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;
      const responseTime = Date.now() - startTime;

      let logLevel = 'log';
      if (statusCode >= 500) logLevel = 'error';
      else if (statusCode >= 400) logLevel = 'warn';

      this.logger[logLevel](
        `⬅️  ${method} ${originalUrl} ${statusCode} ${contentLength}B - ${responseTime}ms`,
      );
    });

    next();
  }
}