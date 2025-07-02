import { NextFunction, Request, Response } from 'express';
import likeService from '../services/like-service';
import {
  createLikeReplySchema,
  createLikeThreadSchema,
} from '../utils/schemas/like-schema';

class LikeController {
  async createLikeThread(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
                  required: true,
                  content: {
                      "application/json": {
                          schema: {
                              $ref: "#/components/schemas/CreateLikeThreadDTO"
                          }  
                      }
                  }
              } 
          */

    try {
      const body = req.body;
      const userId = (req as any).user.id;
      const { threadId } = await createLikeThreadSchema.validateAsync(body);
      const like = await likeService.getLikeBythreadId(userId, threadId || '');

      // if (like) {
      //   res.status(400).json({
      //     message: 'You cannot like thread twice!',
      //   });
      //   return;
      // }

      await likeService.createLikeThread(userId, threadId || '');
      res.json({
        message: 'Like success!',
      });
    } catch (error) {
      next(error);
    }
  }
  async createLikeReply(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
                  required: true,
                  content: {
                      "application/json": {
                          schema: {
                              $ref: "#/components/schemas/CreateLikeReplyDTO"
                          }  
                      }
                  }
              } 
          */

    try {
      const body = req.body;
      const userId = (req as any).user.id;
      const { replyId } = await createLikeReplySchema.validateAsync(body);
      const like = await likeService.getLikeByreplyId(userId, replyId || '');

      // if (like) {
      //   res.status(400).json({
      //     message: 'You cannot like thread twice!',
      //   });
      //   return;
      // }

      await likeService.createLikeReply(userId, replyId || '');
      res.json({
        message: 'Like success!',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLikeThread(req: Request, res: Response, next: NextFunction) {
    try {
      const { threadId } = req.params;

      const userId = (req as any).user.id;

      const like = await likeService.getLikeBythreadId(userId, threadId);

      if (!like) {
        res.status(404).json({
          message: 'Like not found!',
        });
        return;
      }

      await likeService.deleteLike(like.id);
      res.json({
        message: 'Unlike success!',
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteLikeReply(req: Request, res: Response, next: NextFunction) {
    try {
      const { replyId } = req.params;

      const userId = (req as any).user.id;

      const like = await likeService.getLikeByreplyId(
        userId,

        replyId,
      );

      if (!like) {
        res.status(404).json({
          message: 'Like not found!',
        });
        return;
      }

      await likeService.deleteLike(like.id);
      res.json({
        message: 'Unlike success!',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new LikeController();
