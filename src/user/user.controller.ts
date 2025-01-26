import {
  Bind,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { updateUser, user, userLogin } from '../Validator/user';
import { UserService } from './user.service';
import { Public } from 'src/decorators/global.decorator';
import { DataNotFound } from 'src/exceptions/not_found';
import { InvalidCredentials } from 'src/exceptions/invalid_crendentials';
import { DataConflictException } from 'src/exceptions/conflict';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { idValidator } from '../Validator/idValidator';
import { NotAllowedException } from 'src/exceptions/not_allowed';
import { BanGuard } from 'src/ban/ban.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}
  @Get()
  async getUser() {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  @Public()
  @Post()
  async register(@Body() data: user) {
    try {
      const createdUser = await this.userService.register(data);
      return {
        message: 'User created successfully',
        status: HttpStatus.CREATED,
        data: createdUser,
      };
    } catch (error) {
      if (error instanceof DataConflictException) {
        throw new ConflictException(error.message);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post('/login')
  async login(@Body() data: userLogin) {
    try {
      return await this.userService.login(data);
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof InvalidCredentials) {
        throw new UnauthorizedException(error.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  @Put('/update-profile-picture/:id')
  @UseInterceptors(FileInterceptor('profile_picture'))
  @Bind(UploadedFile())
  async updateProfilePicture(
    file: Express.Multer.File,
    @Param() param: idValidator,
    @Request() req,
  ) {
    try {
      const fileUrl = await this.fileService.saveFile(file);
      return await this.userService.updateProfilePicture(
        req.userId,
        param.id,
        fileUrl,
      );
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  @Delete('/:id')
  async deleteAccount(@Param() param: idValidator, @Request() req) {
    try {
      await this.userService.deleteAccount(req.user.userId, param.id);
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof NotAllowedException) {
        throw new UnauthorizedException(error.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  @Patch('/:id')
  async updateUserProfile(
    @Param() param: idValidator,
    @Body() data: updateUser,
    @Request() req,
  ) {
    try {
      return await this.userService.updateProfile(
        req.user.userId,
        param.id,
        data,
      );
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof NotAllowedException) {
        throw new UnauthorizedException(error.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
