import { Like } from '@prisma/client';

export type CreateLikeThreadDTO = Pick<Like, 'threadId'>;

export type DeleteLikeThreadDTO = Pick<Like, 'threadId'>;
export type CreateLikeReplyDTO = Pick<Like, 'replyId'>;

export type DeleteLikeReplyDTO = Pick<Like, 'replyId'>;
