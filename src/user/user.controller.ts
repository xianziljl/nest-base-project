import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/auth.decorator'
import { BaseQuery, PageResult } from 'src/base/base.dto'
import { UpdateUserDto, UserQuery } from './user.dto'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'

@ApiTags('用户')
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Auth()
  @Get('users')
  async page(@Query() query: UserQuery): Promise<PageResult<UserEntity>> {
    return this.userService.filterSortPage(query)
  }

  @ApiParam({ name: 'id', description: '用户id' })
  @Auth()
  @Get('user/:id')
  async findById(@Param('id') id: number, @Query() query: BaseQuery): Promise<UserEntity> {
    return this.userService.findById(id, query)
  }

  @Auth()
  @Put('user')
  async update(@Body() updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.userService.createOrUpdate(updateUserDto)
  }

  @Auth('admin')
  @Delete('user/:ids')
  async delete(@Param('ids') ids: string): Promise<string> {
    await this.userService.delete(ids)
    return ids
  }
}
