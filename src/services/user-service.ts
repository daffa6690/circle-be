import {
  CreateUserDTO,
  UpdateUserDTO,
  UpdateUserProfileDTO,
} from '../dtos/user-dtos';
import prisma from '../libs/prima';

class UserService {
  async getUser(id: string) {
    const followingUser = await prisma.user.findMany({
      include: {
        profile: true,
        _count: {
          select: { followings: true },
        },
      },
      where: {
        followers: {
          some: {
            followingId: id,
          },
        },
        id: { not: id },
      },

      orderBy: [
        {
          followings: {
            _count: 'desc',
          },
        },
      ],
    });

    const otherUsers = await prisma.user.findMany({
      include: {
        profile: true,
        _count: { select: { followings: true } },
      },
      where: {
        followers: { none: { followingId: id } },
        id: { not: id },
      },
      orderBy: {
        followings: { _count: 'desc' },
      },
    });

    return [...followingUser, ...otherUsers];
  }

  async getUsersSuggest(search?: string) {
    return await prisma.user.findMany({
      include: {
        profile: true,
        _count: {
          select: { followers: true },
        },
      },

      orderBy: {
        followers: {
          _count: 'desc',
        },
      },
    });
  }

  async getUserSearch(search?: string, userId?: string) {
    if (search) {
      return await prisma.user.findMany({
        include: {
          profile: true,
        },
        where: {
          OR: [
            {
              username: {
                contains: search,
              },
            },
            {
              profile: {
                fullname: {
                  contains: search,
                },
              },
            },
          ],
        },
      });
    }

    return await prisma.user.findMany({ include: { profile: true } });
  }

  async createUser(data: CreateUserDTO) {
    const { fullname, ...userData } = data;
    return await prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: {
            fullname: data.fullname,
          },
        },
      },
    });
  }
  async getUserById(id: string) {
    return await prisma.user.findFirst({
      where: { id },
      include: {
        profile: true,
        followers: true,
        followings: true,
      },
    });
  }

  async getUserByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
        threads: true,
        followers: true,
        followings: true,
      },
    });
  }
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },

      include: {
        profile: true,
      },
    });
  }
  async deleteUserById(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }
  async updateUserById(id: string, data: UpdateUserDTO) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }
  async getProfileByUserId(userId: string) {
    return await prisma.profile.findFirst({
      where: { userId },
      include: {
        user: true,
      },
    });
  }
  async updateProfileByUserId(profileId: string, data: UpdateUserProfileDTO) {
    const { username, ...profileData } = data;
    return await prisma.profile.update({
      where: { id: profileId },
      data: {
        ...profileData,
        user: {
          update: {
            username: data.username,
          },
        },
      },
    });
  }
}

export default new UserService();
