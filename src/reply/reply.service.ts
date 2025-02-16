import { Injectable } from '@nestjs/common';
import { postReplyDTO } from 'src/DTO/replyDTO';
import { NotAllowedException } from 'src/exceptions/not_allowed';
import { DataNotFound } from 'src/exceptions/not_found';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReplyService {
  constructor(private readonly prisma: PrismaService) {}

  async postReply(data: postReplyDTO) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: data.answerId },
    });
    if (!answer) {
      throw new DataNotFound(
        'The answer you are trying to reply to does not exist',
      );
    }
    return await this.prisma.reply.create({
      data,
    });
  }
  async deleteReply(connectedUser: string, id: string) {
    const reply = await this.prisma.reply.findUnique({
      where: { id },
    });
    if (!reply) {
      throw new DataNotFound(
        'The reply you are trying to delete does not exist',
      );
    }
    if (reply.userId !== connectedUser) {
      throw new NotAllowedException(
        'Only the user who created the reply can delete it',
      );
    }
    return await this.prisma.reply.delete({
      where: { id },
    });
  }
  async getReply(id: string) {
    const reply = await this.prisma.reply.findUnique({
      where: { id },
    });
    if (!reply) {
      throw new DataNotFound('The reply you are trying to get does not exist');
    }
    return reply;
  }
  async getAllReplies() {
    return await this.prisma.reply.findMany();
  }
  async getAnswerReplies(answerId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    });
    if (!answer) {
      throw new DataNotFound(
        'The answer you are trying to get replies for does not exist',
      );
    }
    return await this.prisma.reply.findMany({
      where: { answerId },
    });
  }
  async updateReply(connectedUser: string, id: string, description: string) {
    const reply = await this.prisma.reply.findUnique({
      where: { id },
    });
    if (!reply) {
      throw new DataNotFound(
        'The reply you are trying to update does not exist',
      );
    }
    if (reply.userId !== connectedUser) {
      throw new NotAllowedException(
        'Only the user who created the reply can update it',
      );
    }
    return await this.prisma.reply.update({
      where: { id },
      data: {
        description,
      },
    });
  }
}
