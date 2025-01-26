import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BanGuard implements CanActivate {
  constructor() {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const prisma = new PrismaClient();

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.userId,
      },
    });
    if (dbUser.isBanned) {
      if (dbUser.banExpiresAt > new Date()) {
        throw new ForbiddenException(
          `You are banned until ${dbUser.banExpiresAt}`,
        );
      }
    }
    return true;
  }
}
