import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { RolesGuard } from '../shared/roles.guard'
import { JwtAuthGuard } from './auth.guard'

export function Auth(...roles) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' }),
  )
}