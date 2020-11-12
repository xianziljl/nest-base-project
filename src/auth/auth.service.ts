import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { UserEntity } from 'src/user/user.entity'
import { UserService } from 'src/user/user.service'
import { jwtConst } from 'src/constants'
import ms from 'ms'
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, pwd: string): Promise<UserEntity> {
    const user = await this.userService.getFull({ username })
    if (user && user.password === pwd) return user
    return null
  }

  async getToken(user: UserEntity): Promise<any> {
    const payload = { sub: user.id }
    return {
      token: this.jwtService.sign(payload),
      exp: new Date().getTime() + ms(jwtConst.expiresIn)
    }
  }
}
