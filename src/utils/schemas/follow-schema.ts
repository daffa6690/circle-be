import Joi from 'joi';

import { CreateFollowDTO } from '../../dtos/follow-dtos';

export const createFollowSchema = Joi.object<CreateFollowDTO>({
  followingId: Joi.string().uuid(),
  followedId: Joi.string().uuid(),
});
