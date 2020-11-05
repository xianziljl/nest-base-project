import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleController } from './role.controller'
import { RoleEntity } from './role.entiry'
import { RoleService } from './role.service'

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  exports: [TypeOrmModule],
  providers: [RoleService],
  controllers: [RoleController]
})
export class RoleModule {}
