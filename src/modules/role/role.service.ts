import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { BaseService } from 'src/modules/base/base.service'
import { Repository } from 'typeorm'
import { RoleEntity } from './role.entiry'

@Injectable()
export class RoleService extends BaseService<RoleEntity> {
  constructor(@InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>) {
    super()
    this.repository = this.roleRepository
  }
}
