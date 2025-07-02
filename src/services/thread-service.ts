import { CreateThreadDTO, UpdateThreadDTO } from '../dtos/thread-dtos';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user-dtos';
import prisma from '../libs/prima';

class ThreadService {
  async getThread(pagination?: { limit: number; startIndex: number }) {
    return await prisma.thread.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          omit: {
            password: true,
          },
          include: {
            profile: true,
          },
        },
        likes: true,
        replies: true,
      },
      take: pagination?.limit,
      skip: pagination?.startIndex,
    });
  }
  async getThreadByUser(
    userId: string,
    pagination?: { limit: number; startIndex: number },
  ) {
    return await prisma.thread.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          omit: {
            password: true,
          },
          include: {
            profile: true,
          },
        },
        likes: true,
        replies: true,
      },
      take: pagination?.limit,
      skip: pagination?.startIndex,
    });
  }

  async createThread(userId: string, data: CreateThreadDTO) {
    const { content, images } = data;

    return await prisma.thread.create({
      data: {
        images,
        content,
        userId,
      },
    });
  }

  async getThreadById(id: string) {
    return await prisma.thread.findFirst({
      where: { id },
      include: {
        user: {
          omit: {
            password: true,
          },
          include: {
            profile: true,
          },
        },
        likes: true,
        replies: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            likes: true,

            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
  }
  async deleteThreadById(id: string) {
    return await prisma.thread.delete({
      where: { id },
    });
  }
  async updateThreadById(id: string, data: UpdateThreadDTO) {
    const { content, images } = data;
    return await prisma.thread.update({
      where: { id },
      data: {
        ...(content && { content }),
        ...(images && { images }),
      },
    });
  }
}

export default new ThreadService();
