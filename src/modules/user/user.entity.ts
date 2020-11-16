import { RoleEntity } from 'src/modules/role/role.entiry'
import { BaseEntity } from 'src/modules/base/base.entity'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm'
import { FileEntity } from 'src/modules/file/file.entity'

enum Gender {
  male = 1,
  female = 2
}

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ unique: true, update: false })
  username: string

  @Column({ select: false })
  password: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true, type: 'enum', enum: Gender })
  gender: Gender

  @Column({ type: 'timestamp', nullable: true })
  birthday: Date

  @Column({ default: false })
  blocked: boolean

  @Column({ nullable: true })
  avatarId: string

  @OneToOne(() => FileEntity, { onDelete: 'SET NULL', cascade: true })
  @JoinColumn({ name: 'avatarId' })
  avatar: FileEntity

  @ManyToMany(() => RoleEntity)
  @JoinTable()
  roles: RoleEntity[]
}