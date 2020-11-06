import { Body, Controller, Get, Header, HttpException, HttpStatus, Param, Post, Query, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { BaseQuery, PageResult } from 'src/base/base.dto'
import { FileQuery, ImageQuery, UploadFileDto } from './file.dto'
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

  // @Header('Content-Type', 'image/jpeg,image/png,image/jpg')
  @Get('file/image/:id')
  async downloadImage(@Res() res, @Param('id') id: string, @Query() query: ImageQuery) {
    const w = ~~query.w || undefined
    const h = ~~query.h || undefined
    const stream = await this.fileService.getImageBuffer(id, w, h)
    stream.pipe(res)
  }

  @Header('Content-Type', 'video/mp4,video/mpeg4,video/webm,audio/mpeg,audio/ogg')
  @Get('file/media/:id')
  async downloadMedia(@Res() res, @Param('id') id: string){
    const stream = await this.fileService.getFileBuffer(id)
    stream.pipe(res)
  }

  @Get('file/download/:id')
  async downloadFile(@Res() res, @Param('id') id: string) {
    const stream = await this.fileService.getFileBuffer(id)
    stream.pipe(res)
  }

  @Get('file/:id')
  async getFile(@Param('id') id: string, @Query() query: BaseQuery): Promise<FileEntity> {
    return this.fileService.findById(id, query)
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: '文件上传', type: UploadFileDto })
  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadFiles(@UploadedFiles() files, @Body('tag') tag: string): Promise<FileEntity[]> {
    // console.log('start upload')
    return this.fileService.uploadFiles(files, tag)
  }
}
