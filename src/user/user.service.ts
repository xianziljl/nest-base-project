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

  async findMe(): Promise<UserEntity> {
    return null
  }

  async getFull(query: any = {}): Promise<UserEntity> {
    const qb = this.getQB()
    this.joinQB(qb, 'role')
    qb.addSelect('user.password')
    this.filterQB(qb, query)
    return qb.getOne()
  } 
}
