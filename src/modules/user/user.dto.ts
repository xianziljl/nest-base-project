import { IsBoolean, IsDate, IsInt, IsOptional, IsString, IsUUID, Length } from 'class-validator'
import { PageQuery } from 'src/modules/base/base.dto'
import { RoleEntity } from 'src/modules/role/role.entiry'

export class UserQuery extends PageQuery {
  @IsOptional()
  username?: string

  @IsOptional()
  name?: string

  @IsOptional()
  gender?: string
}

export class CreateOrUpdateUserDto {
  @IsOptional()
  @IsInt()
  readonly id?: number

  @IsOptional()
  readonly username?: string

  @IsOptional()
  readonly password?: string

  @IsOptional()
  @IsString()
  @Length(3, 15)
  readonly name?: string

  @IsOptional()
  @IsInt()
  readonly gender?: number

  @IsOptional()
  @IsDate()
  readonly birthday?: Date

  @IsOptional()
  @IsBoolean()
  readonly blocked?: boolean

  @IsOptional()
  roles?: RoleEntity[]

  @IsOptional()
  @IsUUID()
  readonly avatarId?: string
}

