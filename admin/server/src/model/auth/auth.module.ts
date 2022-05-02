import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenjwtStrategy } from './strategies/jwt';

@Module({
  imports: [UsersModule, 
    PassportModule, 
    JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenjwtStrategy]
})
export class AuthModule {}
