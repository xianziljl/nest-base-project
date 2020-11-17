import { BaseEntity } from 'src/modules/base/base.entity'
import { Column, Entity, ManyToMany } from 'typeorm'
import { UserEntity } from '../user/user.entity'

@Entity('role')
export class RoleEntity extends BaseEntity {
  @Column('varchar')
  name: string

  @Column()
  description: string

  @ManyToMany(() => UserEntity, user => user.roles)
  users: UserEntity[]
}