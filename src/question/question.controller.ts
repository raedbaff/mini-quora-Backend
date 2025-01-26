import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { question, updateQuestion } from 'src/Validator/question';
import { BanGuard } from 'src/ban/ban.guard';
import { DataNotFound } from 'src/exceptions/not_found';
import { NotAllowedException } from 'src/exceptions/not_allowed';
import { idValidator } from 'src/Validator/idValidator';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UseGuards(BanGuard)
  async postQuestion(@Request() req, @Body() data: question) {
    try {
      const user = req.user;
      const tags = data.tags;
      if (tags) {
      }
      return await this.questionService.postQuestion(user.userId, data);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  @Patch('/:id')
  @UseGuards(BanGuard)
  async updateQuestion(
    @Request() req,
    @Body() data: updateQuestion,
    @Param() param: idValidator,
  ) {
    try {
      const connectedUserId = req.user.userId;
      return await this.questionService.updateQuestion(
        connectedUserId,
        param.id,
        data,
      );
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotAllowedException) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
  @Get()
  async getAllQuestions() {
    try {
      return await this.questionService.getAllQuestions();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
