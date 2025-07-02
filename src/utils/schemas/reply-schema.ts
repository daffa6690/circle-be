import joi from 'joi';
import { CreateReplyDTO } from '../../dtos/reply-dtos';

const createReplySchema = joi.object<CreateReplyDTO>({
  content: joi.string().max(500),
});

export { createReplySchema };
