import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { LoggerService } from './logger/logger.service';
import { LoggerModule } from './logger/logger.module';
import { JwtStrategyService } from './user/jwt-strategy.service';
import { FileService } from './file/file.service';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { QuestionModule } from './question/question.module';
import { AdminService } from './admin/admin.service';
import { AnswerModule } from './answer/answer.module';
import { UpvoteModule } from './upvote/upvote.module';
import { ReplyModule } from './reply/reply.module';

@Module({
  imports: [
    UserModule,
    LoggerModule,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    QuestionModule,
    AnswerModule,
    UpvoteModule,
    ReplyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    UserService,
    LoggerService,
    JwtStrategyService,
    FileService,
    AdminService,
  ],
})
export class AppModule {}
