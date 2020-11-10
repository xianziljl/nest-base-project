import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { PageQuery } from 'src/base/base.dto'

export class FileQuery extends PageQuery {
  @ApiProperty({ required: false, description: '标签' })
  @IsOptional()
  tag?: string

  @ApiProperty({ required: false, description: '创建人' })
  @IsOptional()
  createrId?: string

  @ApiProperty({ required: false, description: '格式' })
  @IsOptional()
  ext?: string
}

export class UploadFileDto {
  @ApiProperty({ required: false })
  tag?: string

  @ApiProperty({ type: 'string', format: 'binary' })
  files: any[]
}

export class ImageQuery {
  @ApiProperty({ required: false, description: '宽度' })
  @IsOptional()
  w?: string

  @ApiProperty({ required: false, description: '高度' })
  @IsOptional()
  h?: string
}