import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export abstract class BaseEntiry {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date

  @DeleteDateColumn({ select: false })
  deleted: Date
}