import { Profile, User } from '@prisma/client';

type UserProfile = User & {
  fullname: Profile['fullname'];
};

export type RegisterDTO = Pick<
  UserProfile,
  'email' | 'password' | 'username' | 'fullname'
>;
export type ForgotPasswordDTO = Pick<User, 'email'>;

export type ResetPasswordDTO = {
  confirmpassword: string;
  newpassword: string;
};

export type LoginDTO = Pick<User, 'email' | 'password'>;
