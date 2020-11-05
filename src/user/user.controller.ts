import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger'
import { BaseQuery, PageResult } from 'src/base/base.dto'
import { CreateUserDto, UpdateUserDto, UserQuery } from './user.dto'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'

@ApiTags('用户')
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('users')
  async page(@Query() query: UserQuery): Promise<PageResult<UserEntity>> {
    return this.userService.filterSortPage(query)
  }

  // @Get('users/all')
  // async all(@Query() query: UserQuery): Promise<UserEntity[]> {
  //   return this.userService.filterSort(query)
  // }

  // @Get('test')
  // test(): Promise<UserEntity[]> {
  //   const qb = this.userService.repository.createQueryBuilder('user')
  //   qb.andWhere(`user.id BETWEEN :id_min AND :id_max`, { id_min: 1, id_max: 8 })
  //   qb.andWhere(`user.gender BETWEEN :gender_min AND :gender_max`, { gender_min: 2, gender_max: 5 })
  //   console.log(qb, qb.getSql())
  //   return qb.getMany()
  // }

  @ApiParam({ name: 'id', description: '用户id' })
  @Get('user/:id')
  async findById(@Param('id') id: number, @Query() query: BaseQuery): Promise<UserEntity> {
    return this.userService.findById(id, query)
  }

  @Post('user')
  async createOrUpdate(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.createOrUpdate(createUserDto)
  }

  @Put('user')
  async update(@Body() updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.userService.createOrUpdate(updateUserDto)
  }

  @Delete('user/:ids')
  async delete(@Param('ids') ids: string): Promise<string> {
    await this.userService.delete(ids)
    return ids
  }
}
