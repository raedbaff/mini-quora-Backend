import { IsMongoId } from 'class-validator';

export class idValidator {
  @IsMongoId()
  id: string;
}
