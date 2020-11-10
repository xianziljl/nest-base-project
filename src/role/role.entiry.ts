import { BaseEntiry } from 'src/base/base.entiry'
import { Column, Entity } from 'typeorm'

@Entity('role')
export class RoleEntity extends BaseEntiry {
  @Column('varchar')
  name: string

  @Column()
  description: string
}