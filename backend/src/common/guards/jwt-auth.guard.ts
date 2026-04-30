import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { env } from '../../env';

@Injectable()
export class JwtAuthGuard {
  private parseCookies(cookieString: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (!cookieString) return cookies;
    
    cookieString.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    return cookies;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Try to get token from Authorization header first (Bearer token)
    let token = null;
    const authHeader = request.headers.authorization;

    if (authHeader) {
      token = authHeader.replace('Bearer ', '');
    } else if (request.headers.cookie) {
      // Fall back to cookie if no Authorization header
      const cookies = this.parseCookies(request.headers.cookie);
      token = cookies.access_token;
    }

    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        user_id: string;
        email: string;
        role: string;
      };
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
