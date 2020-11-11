import { IsOptional } from 'class-validator'

export class BaseQuery {
  @IsOptional()
  joins?: string
}

export class SortQuery extends BaseQuery {
  @IsOptional()
  sort?: string
}

export class FilterQuery extends SortQuery {
  @IsOptional()
  id?: string

  @IsOptional()
  ranges?: string // ?ranges=created:2020-09-09~2020-10-10,id:1~,age:~20

  @IsOptional()
  searchFields?: string

  @IsOptional()
  search?: string

}

export class PageQuery extends FilterQuery {
  @IsOptional()
  page?: number

  @IsOptional()
  pageSize?: number
}

export class PageResult<T> {
  total: number
  page: number
  pageSize: number
  list: T[]
}