import Joi from 'joi';
import {
  CreateLikeReplyDTO,
  CreateLikeThreadDTO,
  DeleteLikeReplyDTO,
  DeleteLikeThreadDTO,
} from '../../dtos/like-dtos';

export const createLikeThreadSchema = Joi.object<CreateLikeThreadDTO>({
  threadId: Joi.string().uuid().optional(),
});

export const deleteLikeThreadSchema = Joi.object<DeleteLikeThreadDTO>({
  threadId: Joi.string().uuid().optional(),
});

export const createLikeReplySchema = Joi.object<CreateLikeReplyDTO>({
  replyId: Joi.string().uuid().optional(),
});

export const deleteLikeReplySchema = Joi.object<DeleteLikeReplyDTO>({
  replyId: Joi.string().uuid().optional(),
});
