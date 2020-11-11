import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { Request } from 'express'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // 在这里添加自定义的认证逻辑
    // 例如调用 super.logIn(request) 来建立一个session
    // console.log()
    return super.canActivate(context)
  }

  // handleRequest(err, user, info) {
  //   if (err || !user) throw err || new UnauthorizedException()
  //   return user
  // }
}