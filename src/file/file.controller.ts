import { Body, Controller, Get, Header, Headers, HttpStatus, Param, Post, Query, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { BaseQuery, PageResult } from 'src/base/base.dto'
import { ReadStream } from 'fs'
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

  @Header('Content-Type', 'image/jpeg,image/png,image/jpg')
  @Get('file/image/:id')
  async getImage(@Res() res, @Param('id') id: string, @Query() query: ImageQuery) {
    const w = ~~query.w || undefined
    const h = ~~query.h || undefined
    const stream = await this.fileService.getImage(id, w, h)
    stream.pipe(res)
  }

  @Header('Content-Type', 'video/mp4,video/mpeg4,video/webm,audio/mpeg,audio/ogg')
  @Get('file/media/:id')
  async getMedia(@Headers('range') range, @Res() res, @Param('id') id: string) {
    const file = await this.fileService.findById(id)
    let stream: ReadStream
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : file.size - 1
      stream = await this.fileService.getMedia(file, start, end)
      const head = {
        'Content-Range': `bytes ${start}-${end}/${file.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': (end - start) + 1
      }
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head)
    } else {
      stream = await this.fileService.getFile(file)
    }
    stream.pipe(res)
  }
  

  @Get('file/download/:id')
  async getFile(@Res() res, @Param('id') id: string) {
    const file = await this.fileService.findById(id)
    const stream = await this.fileService.getFile(file)
    stream.pipe(res)
  }

  @Get('file/:id')
  async getFileInfo(@Param('id') id: string, @Query() query: BaseQuery): Promise<FileEntity> {
    return this.fileService.findById(id, query)
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: '文件上传', type: UploadFileDto })
  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 10, {
    limits: { fileSize: 1024 * 1024 * 1024 }
  }))
  uploadFiles(@UploadedFiles() files, @Body('tag') tag: string): Promise<FileEntity[]> {
    // console.log('start upload')
    return this.fileService.uploadFiles(files, tag)
  }
}
