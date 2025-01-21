import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: LoggerService) {
    super();
  }
  async onModuleDestroy() {
    this.logger.log('PrismaService destroyed');
    await this.$disconnect();
  }
  async onModuleInit() {
    this.logger.log('PrismaService instantiated');
    await this.$connect();
  }
}
