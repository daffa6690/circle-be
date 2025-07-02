import { Follow } from '@prisma/client';

export type CreateFollowDTO = Pick<Follow, 'followingId' | 'followedId'>;
