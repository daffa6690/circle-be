import joi from 'joi';
import { CreateThreadDTO } from '../../dtos/thread-dtos';

const createThreadSchema = joi
  .object<CreateThreadDTO>({
    content: joi.string().max(500).optional().allow('', null),
    images: joi.string().optional().allow('', null),
  })
  .custom((value, helpers) => {
    if (!value.content && !value.images) {
      return helpers.message({ custom: "Post can't be empty" });
    }
    return value;
  });

const updateThreadSchema = joi.object<CreateThreadDTO>({
  content: joi.string().max(500).optional().allow('', null),
  images: joi.string().optional().allow('', null),
});

export { createThreadSchema, updateThreadSchema };
