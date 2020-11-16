import { BaseEntity } from 'src/modules/base/base.entity'
import { Column, Entity } from 'typeorm'

@Entity('role')
export class RoleEntity extends BaseEntity {
  @Column('varchar')
  name: string

  @Column()
  description: string
}