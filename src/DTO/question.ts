import { Tag } from '@prisma/client';

export interface postQuestionDTO {
  title: string;
  description: string;
  tags: Tag[];
}
export interface updateQuestionDTO {
  title?: string;
  description?: string;
  tags?: Tag[];
}
