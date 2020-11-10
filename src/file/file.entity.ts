import { UserEntity } from 'src/user/user.entity'
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity('file')
export class FileEntity {
  @PrimaryColumn('uuid')
  id: string

  @CreateDateColumn()
  created: Date

  @DeleteDateColumn({ select: false })
  deleted: Date

  @Column()
  name: string

  @Column()
  path: string

  @Column()
  size: number

  @Column()
  tag: string

  @Column()
  ext: string

  @Column({ nullable: true })
  createrId: number

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createrId' })
  creater: UserEntity
}