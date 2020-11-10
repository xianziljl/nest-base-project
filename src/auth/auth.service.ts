import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { UserEntity } from 'src/user/user.entity'
import { UserService } from 'src/user/user.service'

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

  async login(user: UserEntity): Promise<any> {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role?.name
    }
    return { access_token: this.jwtService.sign(payload) }
  }

  // renewal(user: any) {
  //   return null
  // }
}
