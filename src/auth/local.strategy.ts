import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { UserEntity } from 'src/user/user.entity'
import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super()
  }
  
  async validate(username: string, password: string): Promise<UserEntity> {
    const user = await this.authService.validateUser(username, password)
    if (!user) throw new UnauthorizedException()
    return user
  }
}