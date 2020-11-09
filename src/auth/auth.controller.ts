import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'
import { ChangePwdDto, LoginDto, RegisterDto } from './auth.dto'

@ApiTags('认证')
@Controller()
export class AuthController {
  @Post('login')
  login(@Body() data: LoginDto) {
    return data
  }

  @Post('register')
  register(@Body() data: RegisterDto) {
    return data
  }

  @Put('changePwd')
  changePwd(@Body() data: ChangePwdDto) {
    return data
  }

  @Get('logout')
  logout() {
    return null
  }
  
}
