import { IsMongoId, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class reply {
  @IsMongoId()
  @IsNotEmpty()
  answerId: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  description: string;
}
