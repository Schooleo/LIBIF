import { Controller, Get, Inject, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { AuthErrorDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
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
}
