import {
  IsMongoId,
  IsNotEmpty,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class answer {
  @IsMongoId()
  @IsNotEmpty()
  questionId: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  description: string;
}
export class anwerUpdate {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  newDescription: string;
}
