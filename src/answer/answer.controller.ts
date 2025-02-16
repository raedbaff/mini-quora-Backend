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
import { AnswerService } from './answer.service';
import { answer, anwerUpdate } from 'src/Validator/answer';
import { DataNotFound } from 'src/exceptions/not_found';
import { LoggerService } from 'src/logger/logger.service';
import { BanGuard } from 'src/ban/ban.guard';
import { idValidator } from 'src/Validator/idValidator';
import { NotAllowedException } from 'src/exceptions/not_allowed';
import { Public } from 'src/decorators/global.decorator';

@Controller('answer')
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  @UseGuards(BanGuard)
  async postAnswer(@Request() req, @Body() data: answer) {
    try {
      return await this.answerService.postAnswer(req.user.userId, data);
    } catch (error) {
      this.logger.error(error.message, error);
      if (error instanceof DataNotFound) {
        throw new NotFoundException(error.message);
      }

      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  @Delete('/:id')
  async deleteAnswer(@Request() req, @Param() param: idValidator) {
    try {
      return await this.answerService.deleteAnswer(req.user.userId, param.id);
    } catch (error) {
      this.logger.error(error.message, error);
      if (error instanceof DataNotFound) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotAllowedException) {
        throw new ForbiddenException(error.message);
      }

      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  @Public()
  @Get('/:id')
  async getAnswer(@Param() param: idValidator) {
    try {
      return await this.answerService.getAnswer(param.id);
    } catch (error) {
      this.logger.error(error.message, error);
      if (error instanceof DataNotFound) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  @Public()
  @Get('/question/:id')
  async getQuestionAnswers(
    @Param() param: idValidator,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    try {
      if (!page || !limit) {
        throw new BadRequestException('page and limit are required');
      }
      if (isNaN(parseInt(page)) || isNaN(parseInt(limit))) {
        throw new BadRequestException('page and limit should be numbers');
      }
      if (parseInt(page) < 1 || parseInt(limit) < 1) {
        throw new BadRequestException(
          'page and limit should be greater than 0',
        );
      }
      return await this.answerService.getAnswersByQuestionId(
        param.id,
        parseInt(page),
        parseInt(limit),
      );
    } catch (error) {
      this.logger.error(error.message, error);
      if (error instanceof DataNotFound) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  @Patch('/:id')
  async updateAnswer(
    @Request() req,
    @Param() param: idValidator,
    @Body() data: anwerUpdate,
  ) {
    try {
      return await this.answerService.updateAnswer(
        req.user.userId,
        param.id,
        data,
      );
    } catch (error) {
      this.logger.error(error.message, error);
      if (error instanceof DataNotFound) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof NotAllowedException) {
        throw new ForbiddenException(error.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
