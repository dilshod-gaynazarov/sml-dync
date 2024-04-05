import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Unauthorized } from '../exception/auth.exception';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req.user.id == req.params.id || req.user.role == 'admin') {
      return true;
    }
    throw new Unauthorized();
  }
}
