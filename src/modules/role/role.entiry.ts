import { BaseEntiry } from 'src/modules/base/base.entiry'
import { Column, Entity } from 'typeorm'

@Entity('role')
export class RoleEntity extends BaseEntiry {
  @Column('varchar')
  name: string

  @Column()
  description: string
}