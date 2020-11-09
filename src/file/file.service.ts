import { HttpException, HttpStatus, Injectable, NotFoundException, UnsupportedMediaTypeException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { createWriteStream, createReadStream, existsSync, mkdirSync, ReadStream } from 'fs'
import { join } from 'path'
import { BaseService } from 'src/base/base.service'
import { Repository } from 'typeorm'
import { FileEntity } from './file.entity'
import * as sharp from 'sharp'

@Injectable()
export class FileService extends BaseService<FileEntity> {
  constructor(@InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>) {
    super()
    this.repository = this.fileRepository
  }

  static uploadDir = join(__dirname, '..', '..', 'upload_files')

  static cacheDir = join(FileService.uploadDir, '__cache')

  static imageExts = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'tiff'])

  static getFilePath(file: FileEntity) {
    return join(FileService.uploadDir, file.path, `${file.id}.${file.ext}`)
  }

  async uploadFiles(files: any[], tag: string): Promise<FileEntity[]> {
    const _tag = tag || 'default'
    const res: FileEntity[] = []
    for (const file of files) {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      // const date = now.getDate()
      const _path = join(_tag, year.toString(), month.toString())
      const fileData = {
        name: file.originalname,
        size: file.size,
        path: _path,
        tag: _tag,
        ext: file.originalname.match(/\.\w+$/)?.[0].substr(1),
        createrId: 1
      }
      const f = await this.createOrUpdate(fileData)

      const dirPath = join(FileService.uploadDir,  _path)
      if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true })

      const realPath = join(dirPath, `${f.id}.${fileData.ext}`)
      const whiteImage = createWriteStream(realPath)
      whiteImage.write(file.buffer)

      res.push(f)
    }
    return res
  }

  async getImage(file: FileEntity, w: number | undefined, h: number | undefined): Promise<ReadStream> {
    if (!file) throw new NotFoundException()
    if (!FileService.imageExts.has(file.ext)) throw new UnsupportedMediaTypeException()

    const filePath = FileService.getFilePath(file)

    if (!w && !h) return createReadStream(filePath)

    const cacheName = `${file.id}.${w || ''}x${h || ''}.jpg`
    const cachePath = join(FileService.cacheDir, cacheName)

    if (existsSync(cachePath)) return createReadStream(cachePath)

    const img = sharp(filePath).resize(w, h, { fit: 'cover' })
    if (!existsSync(FileService.cacheDir)) mkdirSync(FileService.cacheDir)
    await img.toFile(cachePath)
    return createReadStream(cachePath)
  }

  async getMedia(file: FileEntity, start: number, end: number): Promise<ReadStream> {
    if(start >= file.size) {
      throw new HttpException(`Requested range not satisfiable\n${start} >= ${file.size}`, HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
    }
    const filePath = FileService.getFilePath(file)
    const chunk = createReadStream(filePath, { start, end })
    return chunk
  }

  async getFile(file: FileEntity): Promise<ReadStream> {
    const filePath = FileService.getFilePath(file)
    return createReadStream(filePath)
  }
}
