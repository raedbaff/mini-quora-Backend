import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { question, updateQuestion } from 'src/Validator/question';
import { BanGuard } from 'src/ban/ban.guard';
import { DataNotFound } from 'src/exceptions/not_found';
import { NotAllowedException } from 'src/exceptions/not_allowed';
import { idValidator } from 'src/Validator/idValidator';
import { Public } from 'src/decorators/global.decorator';

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
  @Get('/:id')
  async getUserQuestions(
    @Param() param: idValidator,
    @Query('page') page: string,
    @Query('numberOfQuestions') numberOfQuestions: string,
  ) {
    try {
      if (!page || !numberOfQuestions) {
        throw new BadRequestException(
          'page and numberOfQuestions are required bro',
        );
      }
      if (isNaN(parseInt(page)) || isNaN(parseInt(numberOfQuestions))) {
        throw new BadRequestException(
          'page and numberOfQuestions should be numbers',
        );
      }
      if (parseInt(page) < 1 || parseInt(numberOfQuestions) < 1) {
        throw new BadRequestException(
          'page and numberOfQuestions should be greater than 0',
        );
      }

      return await this.questionService.getQuestionsByUserId(
        param.id,
        parseInt(page),
        parseInt(numberOfQuestions),
      );
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
  @Public()
  @Get('/single/:id')
  async getQuestionById(@Param() param: idValidator) {
    try {
      return await this.questionService.getQuestionById(param.id);
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
  @Delete('/:id')
  async deleteQuestion(@Request() req, @Param() param: idValidator) {
    try {
      const connectedUserId = req.user.userId;
      return await this.questionService.deleteQuestion(
        connectedUserId,
        param.id,
      );
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotAllowedException) {
        throw new ForbiddenException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
