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
import { AuthModule } from './auth/auth.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { ConfigModule } from '@nestjs/config'
import { dbConst } from './constants'
// import { APP_GUARD } from '@nestjs/core'
// import { RolesGuard } from './shared/roles.guard'

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    //   exclude: ['/api*']
    // }),
    // ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: dbConst.host,
      port: dbConst.port,
      username: dbConst.user,
      password: dbConst.pass,
      database: dbConst.name,
      entities: [UserEntity, RoleEntity, FileEntity],
      synchronize: true,
      retryAttempts: 2
    }),
    AuthModule,
    UserModule,
    RoleModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard
    // }
  ],
})
export class AppModule {}
