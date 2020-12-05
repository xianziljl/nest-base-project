import { Module } from '@nestjs/common'
import { EnumerationService } from './enumeration.service'
import { EnumerationController } from './enumeration.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EnumerationEntity } from './enumeration.entity'

@Module({
  imports: [TypeOrmModule.forFeature([EnumerationEntity])],
  providers: [EnumerationService],
  controllers: [EnumerationController]
})
export class EnumerationModule { }
