import { Module } from '@nestjs/common'
// import { join } from 'path'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './modules/user/user.module'
import { UserEntity } from './modules/user/user.entity'
import { RoleModule } from './modules/role/role.module'
import { RoleEntity } from './modules/role/role.entiry'
import { FileModule } from './modules/file/file.module'
import { FileEntity } from './modules/file/file.entity'
import { AuthModule } from './modules/auth/auth.module'
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { ConfigModule } from '@nestjs/config'
import { dbConst } from './config/constants'
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
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard
    // }
  ],
})
export class AppModule {}
