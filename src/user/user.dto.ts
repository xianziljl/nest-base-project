import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'
import { PageQuery } from 'src/base/base.dto'

export class UserQuery extends PageQuery {
  @ApiProperty({ required: false, description: '用户名' })
  @IsOptional()
  username?: string

  @ApiProperty({ required: false, description: '姓名' })
  @IsOptional()
  name?: string

  @ApiProperty({ required: false, description: '性别' })
  @IsOptional()
  gender?: string

  @ApiProperty({ required: false, description: '角色ID' })
  @IsOptional()
  role?: string
}

export class LoginDto {
  @IsNotEmpty()
  readonly username: string

  @IsNotEmpty()
  readonly password: string

  @IsNotEmpty()
  readonly code: string
}

export class UpdateUserDto {
  @ApiProperty({ description: 'ID' })
  @IsInt()
  readonly id: number

  @ApiProperty({ description: '密码' })
  @IsOptional()
  readonly password: string

  @ApiProperty({ description: '姓名', required: false })
  @IsOptional()
  @IsString()
  @Length(3, 15)
  readonly name?: string

  @ApiProperty({ description: '性别', required: false })
  @IsOptional()
  @IsInt()
  readonly gender?: number

  @ApiProperty({ description: '生日', required: false })
  @IsOptional()
  @IsDate()
  readonly birthday?: Date

  @ApiProperty({ description: '锁定', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  readonly blocked?: boolean
  

  @ApiProperty({ description: '角色ID', required: false })
  @IsOptional()
  @IsInt()
  readonly role?: number
}

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty()
  @Length(3, 15)
  readonly username: string

  @ApiProperty({ description: '密码' })
  @IsNotEmpty()
  readonly password: string
}
