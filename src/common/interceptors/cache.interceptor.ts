import {
  Injectable,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  private readonly logger = new Logger('Cache');

  protected async trackBy(
    context: ExecutionContext,
  ): Promise<string | undefined> {
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, url, query } = request;

    if (method !== 'GET') return undefined;
    if (url.includes('/admin/')) return undefined;

    const key = `${method}-${url}-${JSON.stringify(query)}`;
    this.logger.debug(`Cache key: ${key}`);
    return key;
  }

  // ✅ حالا async هست و Promise<Observable> برمی‌گردونه
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const isPublic = !request.headers?.authorization;

    if (!isPublic) {
      return next.handle();
    }

    const result$ = await super.intercept(context, next);

    return result$.pipe(
      tap(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const url = request.url;
        this.logger.debug(`Cached response for: ${String(url)}`);
      }),
    );
  }
}