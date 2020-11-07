import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, password: string): Promise<UserEntity> {
    const qb = this.userService.getQB()
    qb.select('user.id')
    const user = await qb.where({ username }).getOne()
    if (!user) return null
    if (user.password !== password) return null
    return user
  }
}
