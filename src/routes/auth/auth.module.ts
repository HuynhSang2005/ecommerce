import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RoleService } from './role.service';
import { AuthRepository } from './repository/auth.repo';

@Module({
  providers: [AuthService, RoleService, AuthRepository],
  controllers: [AuthController]
})
export class AuthModule {}
