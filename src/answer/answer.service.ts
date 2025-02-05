import { Injectable } from '@nestjs/common';
import { postAnswerDTO } from 'src/DTO/answerDTO';
import { NotAllowedException } from 'src/exceptions/not_allowed';
import { DataNotFound } from 'src/exceptions/not_found';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnswerService {
  constructor(private readonly prisma: PrismaService) {}

  async postAnswer(connectedUserId: string, data: postAnswerDTO) {
    const question = await this.prisma.question.findUnique({
      where: { id: data.questionId },
    });
    if (!question) {
      throw new DataNotFound(`Question with id ${data.questionId} not found`);
    }
    const answer = await this.prisma.answer.create({
      data: {
        description: data.description,
        userId: connectedUserId,
        questionId: data.questionId,
      },
    });
    if (answer) {
      await this.prisma.question.update({
        where: { id: data.questionId },
        data: {
          numberOfAnswers: { increment: 1 },
        },
      });
    }
    return answer;
  }
  async deleteAnswer(connectedUserId: string, answerId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    });
    if (!answer) {
      throw new DataNotFound(`Answer with id ${answerId} not found`);
    }
    if (answer.userId !== connectedUserId) {
      throw new NotAllowedException(
        `You are not allowed to delete this answer`,
      );
    }
    await this.prisma.answer.delete({
      where: { id: answerId },
    });
    await this.prisma.question.update({
      where: { id: answer.questionId },
      data: {
        numberOfAnswers: { decrement: 1 },
      },
    });
  }
  async getAnswer(answerId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    });
    if (!answer) {
      throw new DataNotFound(`Answer with id ${answerId} not found`);
    }
    return answer;
  }
  async getAnswers(page: number, limit: number) {
    const answers = await this.prisma.answer.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return answers;
  }
  async getAnswersByQuestionId(
    questionId: string,
    page: number,
    limit: number,
  ) {
    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      skip: (page - 1) * limit,
      take: limit,
    });
    return answers;
  }
  async updateAnswer(
    connectedUserId: string,
    answerId: string,
    data: { newDescription: string },
  ) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
      select: { userId: true },
    });
    if (!answer) {
      throw new DataNotFound(`Answer with id ${answerId} not found`);
    }
    if (answer.userId !== connectedUserId) {
      throw new NotAllowedException(
        `Only the author of the answer can update it`,
      );
    }
    try {
      return await this.prisma.answer.update({
        where: { id: answerId },
        data: { description: data.newDescription },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new DataNotFound(`Answer with id ${answerId} not found`);
      }
      throw error;
    }
  }
}
