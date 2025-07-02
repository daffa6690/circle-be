import { Profile, User } from '@prisma/client';

type UserProfile = User & {
  fullname: Profile['fullname'];
  bio: Profile['bio'];
  avatarUrl: Profile['avatarUrl'];
  bannerUrl: Profile['bannerUrl'];
};

type ProfileUser = Profile & {
  username: User['username'];
};

export type CreateUserDTO = Pick<
  UserProfile,
  'email' | 'password' | 'username' | 'fullname'
>;
export type UpdateUserDTO = Pick<UserProfile, 'email' | 'password'>;
export type UpdateUserProfileDTO = Pick<
  ProfileUser,
  'bio' | 'username' | 'fullname' | 'avatarUrl' | 'bannerUrl'
>;
