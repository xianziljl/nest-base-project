import { IsNotEmpty, IsOptional, Length } from 'class-validator'

export class LoginDto {
  @IsNotEmpty()
  @Length(3, 15)
  username: string

  @IsNotEmpty()
  password: string
}

export class RegisterDto {
  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  password: string

  @IsOptional()
  name: string
}

export class ChangePwdDto {
  @IsNotEmpty()
  password: string

  @IsNotEmpty()
  newPassword: string
}
