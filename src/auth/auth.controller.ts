import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
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

  @UseGuards(AuthGuard('local'))
  @Post('token')
  login(@Body() data: LoginDto, @User() user) {
    return this.authService.login(user)
  }

  @Auth()
  @Get('me')
  getMe(@User('id') userId): Promise<UserEntity> {
    return this.userService.findById(userId, { joins: 'role' })
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    console.log(data)
    return data
  }

  @Auth()
  @Put('changePwd')
  async changePwd(@User() user, @Body() data: ChangePwdDto) {
    const _user = await this.authService.validateUser(user.username, data.password)
    if (_user.password !== data.password) {
      return 'Password wrong.'
    }
    await this.userService.update(user.id, { password: data.newPassword })
    return 'Success.'
  }
}
