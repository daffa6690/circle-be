import prisma from '../libs/prima';

class LikeService {
  async getLikeBythreadId(userId: string, threadId: string) {
    return await prisma.like.findFirst({
      where: {
        userId,
        threadId,
      },
    });
  }
  async getLikeByreplyId(userId: string, replyId: string) {
    return await prisma.like.findFirst({
      where: {
        userId,
        replyId,
      },
    });
  }

  async createLikeThread(userId: string, threadId: string) {
    return await prisma.like.create({
      data: {
        userId,
        threadId,
      },
    });
  }
  async createLikeReply(userId: string, replyId: string) {
    return await prisma.like.create({
      data: {
        userId,
        replyId,
      },
    });
  }

  async deleteLike(id: string) {
    return await prisma.like.delete({
      where: { id },
    });
  }
}

export default new LikeService();
