import { RoleEntity } from 'src/role/role.entiry'
import { BaseEntiry } from 'src/base/base.entiry'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm'
import { FileEntity } from 'src/file/file.entity'

enum Gender {
  male = 1,
  female = 2
}

@Entity('user')
export class UserEntity extends BaseEntiry {
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