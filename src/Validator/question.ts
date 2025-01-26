import { Tag } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class question {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(4)
  @MaxLength(1000)
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Tag, { each: true })
  tags: Tag[];
}
export class updateQuestion {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  @IsOptional()
  title?: string;

  @IsString()
  @MinLength(4)
  @MaxLength(1000)
  @IsOptional()
  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Tag, { each: true })
  @IsOptional()
  tags?: Tag[];
}
