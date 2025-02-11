import { Injectable, NotFoundException } from '@nestjs/common';
import { DataConflictException } from 'src/exceptions/conflict';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UpvoteService {
  constructor(private readonly prisma: PrismaService) {}

  async upvoteQuestion(connectedUserId: string, questionId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    await this.prisma.$transaction(async (prisma) => {
      const downvote = await prisma.downVote.findFirst({
        where: { userId: connectedUserId, questionId: question.id },
      });
      if (downvote) {
        await prisma.downVote.delete({
          where: { id: downvote.id },
        });
        await prisma.question.update({
          where: { id: question.id },
          data: { numberOfDownvotes: { decrement: 1 } },
        });
      }

      const upvote = await prisma.upvote.findFirst({
        where: { userId: connectedUserId, questionId: question.id },
      });
      if (upvote) return;

      const newUpvote = await prisma.upvote.create({
        data: {
          questionId: question.id,
          userId: connectedUserId,
        },
      });
      if (newUpvote) {
        await prisma.question.update({
          where: { id: question.id },
          data: { numberOfUpvotes: { increment: 1 } },
        });
      }
    });
  }
  async upvoteAnswer(connectedUserId: string, answerId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    });
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    await this.prisma.$transaction(async (prisma) => {
      const downvote = await prisma.downVote.findFirst({
        where: { userId: connectedUserId, answerId: answer.id },
      });
      if (downvote) {
        await prisma.downVote.delete({
          where: { id: downvote.id },
        });
        await prisma.answer.update({
          where: { id: answer.id },
          data: { numberOfDownvotes: { decrement: 1 } },
        });
      }

      const upvote = await prisma.upvote.findFirst({
        where: { userId: connectedUserId, answerId: answer.id },
      });
      if (upvote) return;

      const newUpvote = await prisma.upvote.create({
        data: {
          answerId: answer.id,
          userId: connectedUserId,
        },
      });
      if (newUpvote) {
        await prisma.answer.update({
          where: { id: answer.id },
          data: { numberOfUpvotes: { increment: 1 } },
        });
      }
    });
  }
  async downvoteQuestion(connectedUserId: string, questionId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    await this.prisma.$transaction(async (prisma) => {
      const upvote = await prisma.upvote.findFirst({
        where: { userId: connectedUserId, questionId: question.id },
      });
      if (upvote) {
        await prisma.upvote.delete({
          where: { id: upvote.id },
        });
        await prisma.question.update({
          where: { id: question.id },
          data: { numberOfUpvotes: { decrement: 1 } },
        });
      }

      const downvote = await prisma.downVote.findFirst({
        where: { userId: connectedUserId, questionId: question.id },
      });
      if (downvote) return;

      const newDownvote = await prisma.downVote.create({
        data: {
          questionId: question.id,
          userId: connectedUserId,
        },
      });
      if (newDownvote) {
        await prisma.question.update({
          where: { id: question.id },
          data: { numberOfDownvotes: { increment: 1 } },
        });
      }
    });
  }
  async downvoteAnswer(connectedUserId: string, answerId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    });
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }
    await this.prisma.$transaction(async (prisma) => {
      const upvote = await prisma.upvote.findFirst({
        where: { userId: connectedUserId, answerId: answer.id },
      });
      if (upvote) {
        await prisma.upvote.delete({
          where: { id: upvote.id },
        });
        await prisma.answer.update({
          where: { id: answer.id },
          data: { numberOfUpvotes: { decrement: 1 } },
        });
      }
      const downvote = await prisma.downVote.findFirst({
        where: { userId: connectedUserId, answerId: answer.id },
      });
      if (downvote) return;
      await prisma.downVote.create({
        data: {
          answerId: answer.id,
          userId: connectedUserId,
        },
      });
      await prisma.answer.update({
        where: { id: answer.id },
        data: { numberOfDownvotes: { increment: 1 } },
      });
    });
  }
}
