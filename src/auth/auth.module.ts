import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { UserModule } from 'src/users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1y' },
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
