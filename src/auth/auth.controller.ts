import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'
import { UserEntity } from 'src/user/user.entity'
import { UserService } from 'src/user/user.service'
import { ChangePwdDto, LoginDto, RegisterDto } from './auth.dto'
import { AuthService } from './auth.service'
import { User } from '../shared/user.decorator'
import { Auth } from 'src/auth/auth.decorator'

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('token')
  async login(@Body() data: LoginDto) {
    const user = await this.authService.validateUser(data.username, data.password)
    if (user) return this.authService.getToken(user)
    else return { code: -1, message: 'Username or password wrong.' }
  }

  @Auth()
  @Get('refreshToken')
  async refreshToken(@User() user) {
    return this.authService.getToken(user)
  }

  @Auth()
  @Get('me')
  getMe(@User() user): Promise<UserEntity> {
    return user
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    const { username } = data
    const user = await this.userService.findOne({ username })
    if (user) {
      return { code: -1, message: 'Username already exist.' }
    }
    return await this.userService.create(data)
  }

  @Auth()
  @Put('changePwd')
  async changePwd(@User() user, @Body() data: ChangePwdDto) {
    const _user = await this.authService.validateUser(user.username, data.password)
    if (_user.password !== data.password) {
      return { code: -1, message: 'Password wrong.' }
    }
    await this.userService.update(user.id, { password: data.newPassword })
    return 'Success.'
  }
}
