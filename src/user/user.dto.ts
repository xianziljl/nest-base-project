import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsInt, IsOptional, IsString, IsUUID, Length } from 'class-validator'
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
}

export class CreateOrUpdateUserDto {
  @ApiProperty({ description: 'ID', required: false })
  @IsOptional()
  @IsInt()
  readonly id?: number
  
  @ApiProperty({ description: 'username', required: false })
  @IsOptional()
  readonly username?: string

  @ApiProperty({ description: 'password', required: false })
  @IsOptional()
  readonly password?: string

  @ApiPropertyOptional({ description: '姓名' })
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

  @ApiProperty({ required: false, description: '角色' })
  @IsOptional()
  roles?: { [id: string]: number }[]

  @ApiProperty({ description: '头像文件ID', required: false })
  @IsOptional()
  @IsUUID()
  readonly avatarId?: string
}

