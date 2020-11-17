import { IsOptional } from 'class-validator'
import { FilterQuery } from '../base/base.dto'

export class RoleQuery extends FilterQuery {
  @IsOptional()
  name?: string

  @IsOptional()
  description?: string
}