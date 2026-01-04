import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { parseLocale } from './i18n.util';

/**
 * Custom parameter decorator to extract locale from request
 *
 * Usage in controller:
 * @Get()
 * findAll(@Locale() locale: Locale) {
 *   // locale is automatically parsed from query param or header
 * }
 */
export const Locale = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return parseLocale(request);
  },
);
