import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({ example: 'reader@example.edu' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 12, example: 'correct horse battery staple' })
  @IsString()
  @MinLength(12)
  password!: string;
}

export class SignInRequestDto {
  @ApiProperty({ example: 'reader@example.edu' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'correct horse battery staple' })
  @IsString()
  @MinLength(1)
  password!: string;
}

export class PasswordResetRequestDto {
  @ApiProperty({ example: 'reader@example.edu' })
  @IsEmail()
  email!: string;
}

export class PasswordResetDto {
  @ApiProperty({ example: 'reset-token-from-email' })
  @IsString()
  @MinLength(32)
  token!: string;

  @ApiProperty({ minLength: 12, example: 'new correct horse battery staple' })
  @IsString()
  @MinLength(12)
  password!: string;
}

export class AuthMessageDto {
  @ApiProperty({ example: 'If an account exists for that email, a reset link has been sent.' })
  message!: string;
}
