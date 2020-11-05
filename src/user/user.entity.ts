import { RoleEntity } from 'src/role/role.entiry'
import { BaseEntiry } from 'src/base/base.entiry'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
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

  @Column()
  name: string

  @Column({ nullable: true, enum: Gender })
  gender: Gender

  @Column({ type: 'timestamp', nullable: true })
  birthday: Date

  @Column({ default: false })
  blocked: boolean

  @OneToOne(() => FileEntity)
  @JoinColumn({ name: 'avatar' })
  avatar: FileEntity

  @ManyToOne(() => RoleEntity, { onDelete: 'SET NULL', cascade: true })
  @JoinColumn()
  role: RoleEntity
}