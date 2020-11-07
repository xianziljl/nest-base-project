import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { createWriteStream, createReadStream, existsSync, mkdirSync, statSync, ReadStream } from 'fs'
import { join } from 'path'
import { BaseService } from 'src/base/base.service'
import { Repository } from 'typeorm'
import { FileEntity } from './file.entity'
import * as sharp from 'sharp'
import { Readable } from 'stream'

@Injectable()
export class FileService extends BaseService<FileEntity> {
  constructor(@InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>) {
    super()
    this.repository = this.fileRepository
  }

  static imageExts = new Set(['jpg', 'jpeg', 'png', 'webp'])

  static getFilePath(file) {
    return join(__dirname, '../', file.path, `${file.id}.${file.ext}`)
  }

  async uploadFiles(files: any[], tag: string): Promise<FileEntity[]> {
    const _tag = tag || 'default'
    const res: FileEntity[] = []
    for (const file of files) {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      // const date = now.getDate()
      const _path = join('upload', _tag, year.toString(), month.toString())
      const fileData = {
        name: file.originalname,
        size: file.size,
        path: _path,
        tag: _tag,
        ext: file.originalname.match(/\.\w+$/)?.[0].substr(1),
        createrId: 1
      }
      const f = await this.createOrUpdate(fileData)

      const dirPath = join(__dirname, '../',  _path)
      if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true })

      const realPath = join(dirPath, `${f.id}.${fileData.ext}`)
      const whiteImage = createWriteStream(realPath)
      whiteImage.write(file.buffer)

      res.push(f)
    }
    return res
  }

  async getImage(id: string, w: number | undefined, h: number | undefined): Promise<Readable> {
    const file = await this.findById(id)
    if (!FileService.imageExts.has(file.ext)) {
      throw new HttpException('Image does not exist.', HttpStatus.NOT_FOUND)
    }
    const filePath = FileService.getFilePath(file)

    if (!w && !h) return createReadStream(filePath)
    // console.time('clip')
    const img = sharp(filePath)
    const buffer = await img.resize(w, h, { fit: 'cover' }).jpeg().toBuffer()
    // console.timeEnd('clip')
    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)
    return stream
  }

  async getMedia(file: FileEntity, start: number, end: number): Promise<ReadStream> {
    const filePath = FileService.getFilePath(file)
    if(start >= file.size) {
      throw new HttpException(`Requested range not satisfiable\n${start} >= ${file.size}`, HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
    }
    const chunk = createReadStream(filePath, { start, end })
    return chunk
  }

  async getFile(file: FileEntity): Promise<ReadStream> {
    const filePath = FileService.getFilePath(file)
    return createReadStream(filePath)
  }
}
