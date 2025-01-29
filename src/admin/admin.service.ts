import {
  Injectable,
  InternalServerErrorException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AdminService implements OnApplicationBootstrap {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}
  async onApplicationBootstrap() {
    try {
      const admin = await this.prisma.user.findUnique({
        where: { email: process.env.ADMIN_EMAIL },
      });
      if (!admin) {
        const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        const newAdmin = await this.prisma.user.create({
          data: {
            email: process.env.ADMIN_EMAIL,
            password: adminPassword,
            role: Role.ADMIN,
          },
        });
        this.logger.log(`Admin created ${newAdmin}`);
      }
      this.logger.log('Admin already exists');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
