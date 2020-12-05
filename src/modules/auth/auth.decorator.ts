import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
// import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { RolesGuard } from 'src/common/roles.guard'

export function Auth(...roles) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' }),
  )
}