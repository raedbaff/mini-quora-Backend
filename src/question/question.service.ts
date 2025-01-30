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
    const question = await this.prisma.question.findUnique({
      where: { id },
    });
    if (!question) {
      throw new DataNotFound(`Question with id ${id} not found`);
    }
    return question;
  }
  async deleteQuestion(connectedUserId: string, id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });
    if (!question) {
      throw new DataNotFound(`Question with id ${id} not found`);
    }
    if (question.userId !== connectedUserId) {
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
  async getQuestionsByUserId(userId: string, page: number, limit: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new DataNotFound(`User with id ${userId} not found`);
    }
    return await this.prisma.question.findMany({
      where: { userId },
      skip: ((page ?? 1) - 1) * limit,
      take: limit ?? 10,
    });
  }
}
