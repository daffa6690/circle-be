import { NextFunction, Request, Response } from 'express';
import likeService from '../services/like-service';
import replyService from '../services/reply-service';
import { createReplySchema } from '../utils/schemas/reply-schema';
class replyController {
  async getReplyByThreadId(req: Request, res: Response, next: NextFunction) {
    try {
      const threadId = req.params.threadId;
      const replies = await replyService.getReplies(threadId);
      const userId = (req as any).user.id;

      const newReplies = await Promise.all(
        replies.map(async (reply) => {
          const like = await likeService.getLikeByreplyId(userId, reply.id);
          const isLike = like ? true : false;
          const likesCount = reply.likes ? reply.likes.length : 0;

          return {
            ...reply,
            likesCount,

            isLike,
          };
        }),
      );

      res.json(newReplies);
    } catch (error) {
      next(error);
    }
  }
  async createReply(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
    required: true,
    content: {
        "multipart/form-data": {
            schema: {
                $ref: "#/components/schemas/CreateReplyDTO"
            }  
        }
    }
} 
*/
    try {
      const threadId = req.params.threadId;
      const body = req.body;

      const userId = (req as any).user.id;

      const validated = await createReplySchema.validateAsync(body);

      const reply = await replyService.createReply(userId, threadId, validated);

      res.json({
        message: 'Reply created',
        data: { ...reply },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReply(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await replyService.deleteReply(id);
      res.json('Delete success');
    } catch (error) {
      next(error);
    }
  }
}

export default new replyController();
