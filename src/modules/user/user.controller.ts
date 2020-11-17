import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger'
// import { Auth } from 'src/auth/auth.decorator'
import { BaseQuery, PageResult } from 'src/modules/base/base.dto'
import { CreateOrUpdateUserDto, UserQuery } from './user.dto'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'

@ApiTags('用户')
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  // @Auth()
  @Get('users')
  async page(@Query() query: UserQuery): Promise<PageResult<UserEntity>> {
    return this.userService.filterSortPage(query)
  }

  @ApiParam({ name: 'id', description: '用户id' })
  // @Auth()
  @Get('user/:id')
  async findById(@Param('id') id: number, @Query() query: BaseQuery): Promise<UserEntity> {
    return this.userService.findById(id, query)
  }

  // @Auth()
  @Post('user')
  async update(@Body() userDto: CreateOrUpdateUserDto): Promise<UserEntity> {
    return this.userService.createOrUpdate(userDto)
  }

  // @Auth('admin')
  @Delete('user/:ids')
  async delete(@Param('ids') ids: string): Promise<string> {
    await this.userService.delete(ids)
    return ids
  }
}
