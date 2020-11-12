import { join } from 'path'

  export const dbConst = {
    host: 'localhost',
    port: 3306,
    name: 'nest_test',
    user: 'root',
    pass: '9867534210'
  }
  export const jwtConst = {
    secret: 'hello_jwt_with_nest.',
    expiresIn: '30m'
  }

  export const fileConst = {
    // 上传文件目录
    uploadDir: join(__dirname, '..', '..', 'upload_files'),
    // 缓存目录
    cacheDir: join(__dirname, '..', '..', 'upload_files', '__cache'),
    // 同时上传个数
    maxCount: 10,
    // 文件大小限制
    fileSize: 1024 * 1024 * 1024
  }
