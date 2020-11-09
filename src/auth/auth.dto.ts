import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class LoginDto {
  @ApiProperty({ required: true, description: '用户名' })
  @IsNotEmpty()
  @Length(3, 15)
  username: string

  @ApiProperty({ required: true, description: '密码' })
  @IsNotEmpty()
  password: string
}

export class RegisterDto {
  @ApiProperty({ required: true, description: '用户名' })
  @IsNotEmpty()
  username: string

  @ApiProperty({ required: true, description: '密码' })
  @IsNotEmpty()
  password: string
}

export class ChangePwdDto {
  @ApiProperty({ required: true, description: '密码' })
  @IsNotEmpty()
  password: string
}
