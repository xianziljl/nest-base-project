import { Controller, Get, Query } from '@nestjs/common';
import { EnumerationQuery } from './enumeration.dto'
import { EnumerationEntity } from './enumeration.entity'
import { EnumerationService } from './enumeration.service'

@Controller()
export class EnumerationController {
  constructor(private enumerationService: EnumerationService) {}

  @Get('enumerations')
  async getLst(@Query() query: EnumerationQuery): Promise<EnumerationEntity[]> {
    return this.enumerationService.filterSort(query)
  }
}
