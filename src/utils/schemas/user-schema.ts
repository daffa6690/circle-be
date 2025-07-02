import joi from 'joi';
import { CreateUserDTO, UpdateUserProfileDTO } from '../../dtos/user-dtos';

import { Profile } from '@prisma/client';

const createUserSchema = joi.object<CreateUserDTO>({
  email: joi.string().email().required(),
  username: joi.string().min(2).required(),
  password: joi.string().min(6).required(),

  fullname: joi.string().required(),
});
const updateUserSchema = joi.object<CreateUserDTO>({
  email: joi.string().email(),
  username: joi.string().min(2),
});
const updateProfileSchema = joi.object<UpdateUserProfileDTO>({
  fullname: joi.string(),
  username: joi.string().min(2),
  bio: joi.string().allow('').optional(),
  avatarUrl: joi.string().optional().allow(''),
  bannerUrl: joi.string().optional().allow(''),
});

export { createUserSchema, updateUserSchema, updateProfileSchema };
