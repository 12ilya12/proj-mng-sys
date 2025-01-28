import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';

@Injectable()

export class RolesGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) : Promise<boolean> {
    /* const roles = this.reflector.get<string[]>('roles', ctx.getHandler())
    if (!roles) {
      return true
    }
    const req = ctx.switchToHttp().getRequest()
    return matchRoles(roles, req.user.role) */

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const currentUserRole = payload.role;
      const shouldBeRole = this.reflector.get<string[]>('roles', context.getHandler());  // список ролей переданный с помощью аннотации SetMetadata
      if (shouldBeRole == null || shouldBeRole.length === 0 || shouldBeRole.includes(currentUserRole))
        return true;
        else
        return false;

      /* // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload; */
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}