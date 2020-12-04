import { Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Query, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { BaseQuery, PageResult } from 'src/modules/base/base.dto'
import { ReadStream } from 'fs'
import { FileQuery, ImageQuery, UploadFileDto } from './file.dto'
import { FileEntity } from './file.entity'
import { FileService } from './file.service'
import { Request, Response } from 'express'
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { fileConst } from 'src/config/constants'
import { User } from 'src/common/user.decorator'
import { UserOptional } from 'src/common/user-optional.decorator'
import { UserEntity } from '../user/user.entity'

@ApiTags('文件')
@Controller()
export class FileController {
  constructor(private fileService: FileService){}

  // @Auth()
  @Get('files')
  getList(@Query() query: FileQuery): Promise<PageResult<FileEntity>> {
    return this.fileService.filterSortPage(query)
  }

  @Get('file/image/:id')
  async getImage(@Res() res: Response, @Param('id') id: string, @Query() query: ImageQuery) {
    const file = await this.fileService.findById(id)
    const w = ~~query.w || undefined
    const h = ~~query.h || undefined
    const q = ~~query.q || undefined
    const stream = await this.fileService.getImage(file, w, h, q)
    res.setHeader('Content-Type', 'image/jpeg,image/png,image/jpg,image/gif')
    stream.pipe(res)
  }

  @Get('file/media/:id')
  async getMedia(@Headers('range') range, @Res() res, @Param('id') id: string) {
    const file = await this.fileService.findById(id)
    let stream: ReadStream
    const contentType = 'video/mp4,video/mpeg4,video/webm,audio/mpeg,audio/ogg'
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : file.size - 1
      stream = await this.fileService.getMedia(file, start, end)
      const head = {
        'Content-Range': `bytes ${start}-${end}/${file.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': (end - start) + 1,
        'Content-Type': contentType
      }
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head)
    } else {
      stream = await this.fileService.getFile(file)
      res.setHeader('Content-Type', contentType)
    }
    stream.pipe(res)
  }
  
  @Get('file/download/:id')
  async getFile(@Res() res, @Param('id') id: string) {
    const file = await this.fileService.findById(id)
    const stream = await this.fileService.getFile(file)
    res.setHeader('content-Type','application/octet-stream');
    res.setHeader('content-Disposition', `attachment;filename=${file.name}`)
    stream.pipe(res)
  }

  @Get('file/:id')
  async getFileInfo(@Param('id') id: string, @Query() query: BaseQuery): Promise<FileEntity> {
    return this.fileService.findById(id, query)
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: '文件上传', type: UploadFileDto })
  @UserOptional()
  @Post('files')
  @UseInterceptors(FilesInterceptor('files', fileConst.maxCount, {
    limits: {
      fileSize: fileConst.fileSize
    },
    storage: diskStorage({
      destination (req: Request, file: any, cb: any) {
        cb(null, FileService.getFileDir(req.body.tag))
      },
      filename (req: Request, file: any, cb: any) {
        cb(null, `${uuidv4()}.${FileService.getFileExt(file.originalname)}`)
      }
    })
  }))
  uploadFiles(@User() user: UserEntity, @UploadedFiles() files, @Body('tag') tag: string): Promise<FileEntity[]> {
    return this.fileService.uploadFiles(files, tag, user)
  }

  // @Auth()
  @Delete('file/:ids')
  async delete(@Param('ids') ids: string): Promise<string> {
    await this.fileService.delete(ids)
    return ids
  }
}
