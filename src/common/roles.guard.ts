import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RoleEntity } from 'src/modules/role/role.entiry'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    const request = context.switchToHttp().getRequest()
    const user = request.user
    if (!user) return false
    if (!roles || !roles.length) return true
    return user.roles?.every((r: RoleEntity) => roles.includes(r.name)) ?? false
  }
}