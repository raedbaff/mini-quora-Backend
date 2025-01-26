import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { JwtStrategyService } from './jwt-strategy.service';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BanGuard } from 'src/ban/ban.guard';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthenticatedGuard,
    },
    BanGuard,
    UserService,
    PrismaService,
    JwtStrategyService,
  ],
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class UserModule {}
