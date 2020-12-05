import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TreeRepository } from 'typeorm'
import { BaseService } from '../base/base.service'
import { EnumerationEntity } from './enumeration.entity'

@Injectable()
export class EnumerationService extends BaseService<EnumerationEntity> {
  constructor(
    @InjectRepository(EnumerationEntity)
    private readonly enumerationRepository: TreeRepository<EnumerationEntity>
  ) {
    super()
    this.repository = this.enumerationRepository
  }

  // https://www.bookstack.cn/read/TypeORM-0.2.20-zh/tree-entities.md
  getTree() {
    return this.enumerationRepository.findTrees()
  }
}
