import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../../../generated/prisma/client';

function trimRequiredString({ value }: { value: unknown }): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class ChangeUserRoleDto {
  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({ minLength: 1, maxLength: 500 })
  @Transform(trimRequiredString)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  reason!: string;
}

export class ChangeUserStatusDto {
  @ApiProperty({ minLength: 1, maxLength: 500 })
  @Transform(trimRequiredString)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  reason!: string;
}
