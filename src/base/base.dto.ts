import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class BaseQuery {
  @ApiProperty({ required: false, description: '关联字段'})
  @IsOptional()
  joins?: string
}

export class SortQuery extends BaseQuery {

  @ApiProperty({ required: false, description: '排序(+fieldName 或 -fieldName)'})
  @IsOptional()
  sort?: string
}

export class FilterQuery extends SortQuery {
  @ApiProperty({ required: false, description: 'ID' })
  @IsOptional()
  id?: string

  @ApiProperty({ required: false, description: '范围筛选'})
  @IsOptional()
  // ?ranges=created:2020-09-09~2020-10-10,id:1~,age:~20
  ranges?: string

  @ApiProperty({ required: false, description: '搜索的字段名(多个逗号隔开)'})
  @IsOptional()
  searchFields?: string

  @ApiProperty({ required: false, description: '搜索'})
  @IsOptional()
  search?: string

}

export class PageQuery extends FilterQuery {
  @ApiProperty({ required: false, description: '页数'})
  @IsOptional()
  page?: number

  @ApiProperty({ required: false, description: '分页大小'})
  @IsOptional()
  pageSize?: number
}

export class BaseCreateOrUpdateDto {

}

export class PageResult<T> {
  total: number
  page: number
  pageSize: number
  list: T[]
}