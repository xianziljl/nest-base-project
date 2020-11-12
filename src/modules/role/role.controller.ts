import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'
import { RoleEntity } from './role.entiry'
import { RoleService } from './role.service'

@ApiTags('角色')
@Controller()
export class RoleController {
  constructor(private roleService: RoleService){}

  @Get('roles')
  get():Promise<RoleEntity[]> {
    return this.roleService.findAll()
  }
}
