import prisma from '../libs/prima';

class FollowService {
  async getFollowerByFollowingId(followingId: string) {
    return await prisma.follow.findMany({
      where: {
        followingId,
      },
      include: {
        follower: {
          include: {
            profile: true,
          },
        },
      },
    });
  }
  async getFollowingByFollowedId(followedId: string) {
    return await prisma.follow.findMany({
      where: {
        followedId,
      },
      include: {
        following: {
          include: {
            profile: true,
          },
        },
      },
    });
  }
  async getFollow(followedId: string, followingId: string) {
    return await prisma.follow.findFirst({
      where: {
        followedId,
        followingId,
      },
    });
  }

  async createFollow(followedId: string, followingId: string) {
    return await prisma.follow.create({
      data: { followedId, followingId },
    });
  }

  async deleteFollow(id: string) {
    return await prisma.follow.delete({
      where: { id },
    });
  }
}

export default new FollowService();
