import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RoleQuery } from './role.dto'
import { RoleEntity } from './role.entiry'
import { RoleService } from './role.service'

@ApiTags('角色')
@Controller()
export class RoleController {
  constructor(private roleService: RoleService) { }

  @Get('roles')
  get(@Query() query: RoleQuery): Promise<RoleEntity[]> {
    return this.roleService.filterSort(query)
  }
}
