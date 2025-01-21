import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

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
export class userLogin {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
