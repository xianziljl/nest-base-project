import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { UserEntity } from './user/user.entity'
import { RoleModule } from './role/role.module'
import { RoleEntity } from './role/role.entiry'
import { FileModule } from './file/file.module'
import { FileEntity } from './file/file.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '9867534210',
      database: 'nest_test',
      entities: [UserEntity, RoleEntity, FileEntity],
      synchronize: true,
      retryAttempts: 2
    }),
    UserModule,
    RoleModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
