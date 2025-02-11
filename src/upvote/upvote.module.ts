import { Module } from '@nestjs/common';
import { UpvoteService } from './upvote.service';
import { UpvoteController } from './upvote.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [UpvoteService, PrismaService],
  controllers: [UpvoteController],
})
export class UpvoteModule {}
