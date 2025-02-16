import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { ReplyService } from './reply.service';
import { reply } from 'src/Validator/reply';
import { DataNotFound } from 'src/exceptions/not_found';
import { NotAllowedException } from 'src/exceptions/not_allowed';
import { Public } from 'src/decorators/global.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}
  @ApiTags('reply')
  @ApiBearerAuth('access-token')
  @Post()
  async postReply(@Request() req, @Body() data: reply) {
    try {
      const userId = req.user.userId;
      const reply = {
        userId,
        ...data,
      };
      return await this.replyService.postReply(reply);
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  @Public()
  @Get('/:id')
  async getReply(id: string) {
    try {
      return await this.replyService.getReply(id);
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  @Public()
  @Get('/answer/:id')
  async getAnswerReplies(answerId: string) {
    try {
      return await this.replyService.getAnswerReplies(answerId);
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  @Get()
  async getAllReplies() {
    try {
      return await this.replyService.getAllReplies();
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  @Delete('/:id')
  async deleteReply(@Request() req, id: string) {
    try {
      const userId = req.user.userId;
      return await this.replyService.deleteReply(userId, id);
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotAllowedException) {
        throw new ForbiddenException(error.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  @Patch('/:id')
  async updateReply(@Request() req, id: string, @Body() description: string) {
    try {
      const userId = req.user.userId;
      return await this.replyService.updateReply(userId, id, description);
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotAllowedException) {
        throw new ForbiddenException(error.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
