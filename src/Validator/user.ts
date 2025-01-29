import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class user {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
export class updateUser {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsOptional()
  username: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @MinLength(8)
  @IsOptional()
  password: string;
}
export class userLogin {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
export class ban {
  @IsString()
  @MaxLength(100)
  banReason: string;
  @IsDate()
  @Type(() => Date)
  banExpiresAt: Date;
}
