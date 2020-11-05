import { ApiProperty } from '@nestjs/swagger'
import { PageQuery } from 'src/base/base.dto'

export class FileQuery extends PageQuery {
  
}

export class UploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  files: any[]

  @ApiProperty({ required: false })
  tag?: string
}