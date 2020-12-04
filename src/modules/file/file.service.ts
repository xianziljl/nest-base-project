import { HttpException, HttpStatus, Injectable, NotFoundException, UnsupportedMediaTypeException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { createReadStream, existsSync, mkdirSync, ReadStream } from 'fs'
import { extname, join, parse } from 'path'
import { BaseService } from 'src/modules/base/base.service'
import { Repository } from 'typeorm'
import { FileEntity } from './file.entity'
import sharp from 'sharp'
import { fileConst } from 'src/config/constants'
import { UserEntity } from '../user/user.entity'

@Injectable()
export class FileService extends BaseService<FileEntity> {
  constructor(@InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>) {
    super()
    this.repository = this.fileRepository
    mkdirSync(fileConst.cacheDir, { recursive: true })
  }

  static imageExts = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'tiff'])

  // 根据数据库文件信息获取文件实际路径
  static getFilePath(file: FileEntity) {
    return join(fileConst.uploadDir, file.path, `${file.id}.${file.ext}`)
  }
  // 根据上传文件信息获取文件应存储的文件夹
  static getFileDir(tag = 'default') {
    const now = new Date()
    const year = now.getFullYear() + ''
    const month = now.getMonth() + 1 + ''
    const dir = join(fileConst.uploadDir, tag, year, month)
    mkdirSync(dir, { recursive: true })
    return dir
  }

  static getFileExt(filename = '') {
    return extname(filename).substr(1).toLowerCase()
  }

  async uploadFiles(files: any[], tag: string, user?: UserEntity): Promise<FileEntity[]> {
    const _tag = tag || 'default'
    const res: FileEntity[] = []
    for (const file of files) {
      const fileInfo = parse(file.path)
      const fileData = {
        id: fileInfo.name,
        name: file.originalname,
        size: file.size,
        path: fileInfo.dir.replace(fileConst.uploadDir, ''),
        tag: _tag,
        ext: FileService.getFileExt(file.originalname),
        createrId: user?.id || 1
      }
      const f = await this.createOrUpdate(fileData)
      res.push(f)
    }
    return res
  }

  async getImage(file: FileEntity, w?: number | undefined, h?: number | undefined, q?: number): Promise<ReadStream> {
    if (!file) throw new NotFoundException()
    if (!FileService.imageExts.has(file.ext)) throw new UnsupportedMediaTypeException()

    const filePath = FileService.getFilePath(file)

    if (!w && !h && !q) return createReadStream(filePath)

    if (q > 100) q = 100
    else if (q < 10) q = 10

    const cacheName = `${file.id}_${w || ''}x${h || ''}x${q || ''}.jpg`
    const cachePath = join(fileConst.cacheDir, cacheName)

    if (existsSync(cachePath)) return createReadStream(cachePath)

    const img = sharp(filePath)
      .resize(w, h, { fit: 'cover' })
      .jpeg({ progressive: true, quality: q })
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
