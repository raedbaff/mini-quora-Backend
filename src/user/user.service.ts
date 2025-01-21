import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginDTO } from './DTO/createUserDto';
import * as bcrypt from 'bcrypt';
import { DataNotFound } from 'src/exceptions/not_found';
import { JwtService } from '@nestjs/jwt';
import { InvalidCredentials } from 'src/exceptions/invalid_crendentials';
import { DataConflictException } from 'src/exceptions/conflict';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async register(userData: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (userExists) {
      throw new DataConflictException(
        `User with email ${userData.email} already exists`,
      );
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    return this.prisma.user.create({
      data: userData,
    });
  }
  async login(userLogin: LoginDTO) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        email: userLogin.email,
      },
    });
    if (!userExists) {
      throw new DataNotFound(`User with email ${userLogin.email} not found`);
    }
    const passwordsMatch = await bcrypt.compare(
      userLogin.password,
      userExists.password,
    );
    if (!passwordsMatch) {
      throw new InvalidCredentials('Invalid Credentials');
    }
    const payload = {
      sub: userExists.id,
      email: userExists.email,
      role: userExists.role,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const { password, ...user } = userExists;
    return {
      user,
      accessToken,
      refreshToken,
    };
  }
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new DataNotFound(`User with id ${id} not found`);
    }
    const { password, ...userData } = user;
    return userData;
  }
  async updateProfilePicture(userId: string, url: string) {
    const user = await this.getUserById(userId);
    const { id, ...userData } = user;
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        profilePic: url,
      },
    });
  }
}
