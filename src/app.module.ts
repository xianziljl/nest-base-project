import { Module } from '@nestjs/common'
import { join } from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { UserEntity } from './user/user.entity'
import { RoleModule } from './role/role.module'
import { RoleEntity } from './role/role.entiry'
import { FileModule } from './file/file.module'
import { FileEntity } from './file/file.entity'
// import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*']
    }),
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
    FileModule,
    // AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
