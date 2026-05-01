import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to specify which roles are allowed to access an endpoint
 *
 * Usage:
 * @Roles('ADMIN', 'FAMILY')
 * @Get('profile')
 * getProfile() { ... }
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
