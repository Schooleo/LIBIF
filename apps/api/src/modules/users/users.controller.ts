import { Body, Controller, Get, HttpCode, Inject, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { AuthErrorDto } from '../auth/dto/session.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import type { SessionUserDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ChangeUserRoleDto, ChangeUserStatusDto } from './dto/user-administration-command.dto';
import { UserListQueryDto } from './dto/user-list-query.dto';
import { UserDetailResponseDto, UserListResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('Admin Users')
@Controller('admin/users')
@UseGuards(RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(@Inject(UsersService) private readonly users: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List user administration records with safe account and session metadata.' })
  @ApiOkResponse({ type: UserListResponseDto })
  @ApiBadRequestResponse({ type: AuthErrorDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  listUsers(@Query() query: UserListQueryDto): Promise<UserListResponseDto> {
    return this.users.listUsers(query);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Return one user administration record with safe session and audit summaries.' })
  @ApiOkResponse({ type: UserDetailResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @ApiNotFoundResponse({ type: AuthErrorDto })
  getUserDetail(@Param('userId') userId: string): Promise<UserDetailResponseDto> {
    return this.users.getUserDetail(userId);
  }

  @Patch(':userId/role')
  @ApiOperation({ summary: 'Change a user role transactionally and revoke active sessions.' })
  @ApiOkResponse({ type: UserDetailResponseDto })
  @ApiBadRequestResponse({ type: AuthErrorDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @ApiConflictResponse({ type: AuthErrorDto })
  @ApiNotFoundResponse({ type: AuthErrorDto })
  changeUserRole(
    @Param('userId') userId: string,
    @Body() input: ChangeUserRoleDto,
    @CurrentUser() actor: SessionUserDto
  ): Promise<UserDetailResponseDto> {
    return this.users.changeUserRole(userId, actor.id, input);
  }

  @Post(':userId/deactivate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Deactivate a user transactionally and revoke active sessions.' })
  @ApiOkResponse({ type: UserDetailResponseDto })
  @ApiBadRequestResponse({ type: AuthErrorDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @ApiConflictResponse({ type: AuthErrorDto })
  @ApiNotFoundResponse({ type: AuthErrorDto })
  deactivateUser(
    @Param('userId') userId: string,
    @Body() input: ChangeUserStatusDto,
    @CurrentUser() actor: SessionUserDto
  ): Promise<UserDetailResponseDto> {
    return this.users.deactivateUser(userId, actor.id, input);
  }

  @Post(':userId/reactivate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reactivate a deactivated user transactionally.' })
  @ApiOkResponse({ type: UserDetailResponseDto })
  @ApiBadRequestResponse({ type: AuthErrorDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  @ApiConflictResponse({ type: AuthErrorDto })
  @ApiNotFoundResponse({ type: AuthErrorDto })
  reactivateUser(
    @Param('userId') userId: string,
    @Body() input: ChangeUserStatusDto,
    @CurrentUser() actor: SessionUserDto
  ): Promise<UserDetailResponseDto> {
    return this.users.reactivateUser(userId, actor.id, input);
  }
}
