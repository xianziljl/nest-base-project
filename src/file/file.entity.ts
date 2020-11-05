import { UserEntity } from 'src/user/user.entity'
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  created: Date

  @DeleteDateColumn({ select: false })
  deleted: Date

  @Column()
  name: string

  @Column({ select: false })
  path: string

  @Column()
  size: number

  @Column()
  tag: string

  @Column()
  ext: string

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'creater' })
  creater: UserEntity
}