import { Thread } from '@prisma/client';

export type CreateThreadDTO = Pick<Thread, 'content' | 'images'>;
export type UpdateThreadDTO = Pick<Thread, 'content' | 'images'>;
