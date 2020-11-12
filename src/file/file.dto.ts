import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { PageQuery } from 'src/base/base.dto'

export class FileQuery extends PageQuery {
  @IsOptional()
  tag?: string

  @IsOptional()
  createrId?: string

  @IsOptional()
  ext?: string
}

export class UploadFileDto {
  tag?: string

  @ApiProperty({ type: 'string', format: 'binary' })
  files: any[]
}

export class ImageQuery {
  @IsOptional()
  w?: string

  @IsOptional()
  h?: string
}