
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger'
import { UserOptionalGuard } from './user-optional.guard'

export function UserOptional() {
  return applyDecorators(
    UseGuards(UserOptionalGuard),
    ApiBearerAuth()
  )
}
