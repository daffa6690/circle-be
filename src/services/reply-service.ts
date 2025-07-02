import { CreateReplyDTO } from '../dtos/reply-dtos';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user-dtos';
import prisma from '../libs/prima';

class ReplyService {
  async getReplies(threadId: string) {
    return await prisma.reply.findMany({
      where: { threadId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        likes: true,
        user: {
          omit: {
            password: true,
          },
          include: {
            profile: true,
          },
        },
        thread: {
          select: {
            userId: true,
          },
        },
      },
    });
  }

  async createReply(userId: string, threadId: string, data: CreateReplyDTO) {
    const { content } = data;

    return await prisma.reply.create({
      data: {
        threadId,
        content,
        userId,
      },
    });
  }

  async deleteReply(id: string) {
    return await prisma.reply.delete({
      where: { id },
    });
  }
}

export default new ReplyService();
