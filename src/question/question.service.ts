import { Injectable } from '@nestjs/common';
import { postQuestionDTO, updateQuestionDTO } from 'src/DTO/question';
import { NotAllowedException } from 'src/exceptions/not_allowed';
import { DataNotFound } from 'src/exceptions/not_found';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async postQuestion(userId: string, data: postQuestionDTO) {
    const questionData = {
      ...data,
      userId,
    };
    return await this.prisma.question.create({
      data: questionData,
    });
  }
  async getAllQuestions() {
    return await this.prisma.question.findMany();
  }
  async getQuestionById(id: string) {
    return await this.prisma.question.findUnique({
      where: {
        id,
      },
    });
  }
  async deleteQuestion(connectedUserId: string, userId: string, id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });
    if (!question) {
      throw new DataNotFound(`Question with id ${id} not found`);
    }
    if (question.userId !== connectedUserId && connectedUserId !== userId) {
      throw new NotAllowedException(
        'You are not allowed to delete this question',
      );
    }
    return await this.prisma.question.delete({
      where: { id },
    });
  }
  async updateQuestion(
    connectedUserId: string,
    questionId: string,
    data: updateQuestionDTO,
  ) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      throw new DataNotFound(`Question with id ${questionId} not found`);
    }
    if (question.userId !== connectedUserId) {
      throw new NotAllowedException(
        'You are not allowed to update this question',
      );
    }
    const { id, ...questionWithoutId } = question;
    return await this.prisma.question.update({
      where: { id: questionId },
      data: {
        ...questionWithoutId,
        ...data,
      },
    });
  }
}
