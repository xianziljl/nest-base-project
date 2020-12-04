import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { Request } from 'express'

@Injectable()
export class UserOptionalGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context)
    return true
  }

  handleRequest(err, user) {
    if (err) throw err
    return user
  }
}