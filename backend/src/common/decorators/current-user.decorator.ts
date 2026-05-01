import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
  user_id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Decorator to inject the current authenticated user from JWT payload
 *
 * Usage:
 * @Get('profile')
 * getProfile(@CurrentUser() user: JwtPayload) {
 *   return user;  // Contains user_id, email, role
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtPayload;
  },
);
