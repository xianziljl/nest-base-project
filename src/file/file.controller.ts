import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { PageResult } from 'src/base/base.dto'
import { FileQuery, UploadFileDto } from './file.dto'
import { FileEntity } from './file.entity'
import { FileService } from './file.service'
// import { diskStorage } from 'multer'

@ApiTags('文件')
@Controller()
export class FileController {
  constructor(private fileService: FileService){}

  @Get('files')
  getList(@Query() query: FileQuery): Promise<PageResult<FileEntity>> {
    return this.fileService.filterSortPage(query)
  }

  @Get('file/:id')
  getFile(@Param('id') id: string): Promise<FileEntity> {
    console.log(id)
    return null
  }

  @Get('files/:ids')
  getFiles(@Param('ids') ids: string): Promise<FileEntity[]> {
    const idsArr = ids.split(',').filter(id => id)
    console.log(idsArr)
    return null
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: '文件上传', type: UploadFileDto })
  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadFiles(@UploadedFiles() files, @Body('tag') tag = 'default'): Promise<FileEntity[]> {
    if (!files.length) {
      throw new HttpException('', HttpStatus.BAD_REQUEST)
    }
    files.forEach(file => {
      const { size, originalname } = file
      const fileData = {
        name: originalname,
        path: '',
        size,
        tag,
        ext: originalname.match(/\.\w+$/)?.[0],
        creater: 1
      }
      console.log(fileData)
    })
    console.log(files)
    return null
  }
}
