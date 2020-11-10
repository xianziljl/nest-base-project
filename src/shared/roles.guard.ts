import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user
    if (!user) return false
    if (!roles || !roles.length) return true
    // if (!roles) return true
    return roles.includes(user.role)
    // console.log('roles.gauard:', user, roles, !!active)
  }
}