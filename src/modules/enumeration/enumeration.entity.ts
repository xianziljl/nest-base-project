import { Column, Entity, TreeChildren, TreeParent } from 'typeorm'
import { BaseEntity } from '../base/base.entity'

@Entity('enumeration')
export class EnumerationEntity extends BaseEntity {
  @Column()
  value: string

  @Column()
  name: string

  @Column({ nullable: true })
  parentId: number

  @TreeParent()
  parent: EnumerationEntity

  @TreeChildren()
  children: EnumerationEntity[]
}