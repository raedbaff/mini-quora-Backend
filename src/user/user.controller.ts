import {
  Bind,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { user, userLogin } from './Validator/user';
import { UserService } from './user.service';
import { Public } from 'src/decorators/global.decorator';
import { DataNotFound } from 'src/exceptions/not_found';
import { InvalidCredentials } from 'src/exceptions/invalid_crendentials';
import { DataConflictException } from 'src/exceptions/conflict';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { idValidator } from './Validator/idValidator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}
  @Get()
  async getUser() {
    return 'User';
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
  ) {
    try {
      const fileUrl = await this.fileService.saveFile(file);
      return await this.userService.updateProfilePicture(param.id, fileUrl);
    } catch (error) {
      if (error instanceof DataNotFound) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
