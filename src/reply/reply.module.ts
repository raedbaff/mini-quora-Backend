import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ReplyService, PrismaService],
  controllers: [ReplyController],
})
export class ReplyModule {}
