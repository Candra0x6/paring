import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard that checks if the user's role matches the allowed roles for an endpoint
 *
 * Must be used AFTER JwtAuthGuard to ensure user is authenticated
 *
 * Usage:
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('ADMIN', 'FAMILY')
 * @Get('profile')
 * getProfile() { ... }
 *
 * If no @Roles() decorator is present, the endpoint is accessible to any authenticated user
 */
@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles metadata from the endpoint decorator
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // If no @Roles() decorator is present, allow any authenticated user
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get the authenticated user from the request (set by JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    // Check if user's role is in the allowed roles list
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `This endpoint requires one of the following roles: ${requiredRoles.join(', ')}. Your role: ${user.role}`,
      );
    }

    return true;
  }
}
