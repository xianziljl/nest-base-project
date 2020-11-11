import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { BaseService } from 'src/base/base.service'
import { Repository } from 'typeorm'
import { UserEntity } from './user.entity'

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
    super()
    this.repository = this.userRepository
  }

  async getFull(query: any = {}): Promise<UserEntity> {
    const qb = this.getQB()
    this.joinQB(qb, 'roles')
    qb.addSelect('user.password')
    this.filterQB(qb, query)
    return qb.getOne()
  }

  // 单纯用于权限模块, 并做缓存处理
  async findMe(id: string | number): Promise<UserEntity> {
    return await this.userRepository.findOne(id, {
      cache: 60000, // 缓存时间 60s
      relations: ['roles']
    })
  }
}
