import { SetMetadata } from '@nestjs/common';
import type { RoleKey } from './dto/session.dto';

export const ROLES_KEY = 'libif:roles';
export const Roles = (...roles: RoleKey[]) => SetMetadata(ROLES_KEY, roles);
