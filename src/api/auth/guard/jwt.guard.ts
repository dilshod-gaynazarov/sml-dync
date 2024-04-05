import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Unauthorized } from '../exception/auth.exception';
import { config } from 'src/config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Unauthorized();
    }
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (bearer !== 'Bearer' || !token) {
      throw new Unauthorized();
    }
    let user: any;
    try {
      user = this.jwtService.verify(token, {
        secret: config.ACCESS_TOKEN_KEY,
      });
      req.user = user;
    } catch (error) {
      throw new Unauthorized();
    }
    return true;
  }
}
