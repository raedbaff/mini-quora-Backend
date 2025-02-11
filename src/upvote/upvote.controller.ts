import {
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { UpvoteService } from './upvote.service';
import { DataNotFound } from 'src/exceptions/not_found';

@Controller('upvote')
export class UpvoteController {
  constructor(private readonly upvoteService: UpvoteService) {}

  @Post('/question/:id')
  async upvoteQuestion(@Request() req, @Param('id') questionId: string) {
    try {
      const connectedUserId = req.user.userId;
      return await this.upvoteService.upvoteQuestion(
        connectedUserId,
        questionId,
      );
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new NotFoundException('Question not found');
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }
  @Post('/answer/:id')
  async upvoteAnswer(@Request() req, @Param('id') answerId: string) {
    try {
      const connectedUserId = req.user.userId;
      return await this.upvoteService.upvoteAnswer(connectedUserId, answerId);
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new NotFoundException('Answer not found');
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }
  @Post('/question/downvote/:id')
  async downvoteQuestion(@Request() req, @Param('id') questionId: string) {
    try {
      const connectedUserId = req.user.userId;
      return await this.upvoteService.downvoteQuestion(
        connectedUserId,
        questionId,
      );
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new NotFoundException('Question not found');
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }
  @Post('/answer/downvote/:id')
  async downvoteAnswer(@Request() req, @Param('id') answerId: string) {
    try {
      const connectedUserId = req.user.userId;
      return await this.upvoteService.downvoteAnswer(connectedUserId, answerId);
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new NotFoundException('Answer not found');
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
