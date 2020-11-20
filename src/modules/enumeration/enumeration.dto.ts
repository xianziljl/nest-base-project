import { IsOptional } from 'class-validator'
import { FilterQuery } from '../base/base.dto'

export class EnumerationQuery extends FilterQuery {
  @IsOptional()
  name?: string

  @IsOptional()
  value?: string

  @IsOptional()
  parentId?: string
}