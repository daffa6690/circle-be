import { NextFunction, Request, Response } from 'express';
import followService from '../services/follow-service';
import { createFollowSchema } from '../utils/schemas/follow-schema';

class FollowController {
  async getFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const { followedId } = req.params;

      const userId = (req as any).user.id;

      const following =
        await followService.getFollowingByFollowedId(followedId);
      const newFollow = await Promise.all(
        following.map(async (follow) => {
          const userfollow = await followService.getFollow(
            userId,
            follow.followingId,
          );
          const isFollow = userfollow ? true : false;

          return {
            ...follow,
            isFollow,
          };
        }),
      );

      res.json(newFollow);
    } catch (error) {
      next(error);
    }
  }
  async getFollower(req: Request, res: Response, next: NextFunction) {
    try {
      const { followingId } = req.params;
      const follower =
        await followService.getFollowerByFollowingId(followingId);

      const userId = (req as any).user.id;

      const newFollow = await Promise.all(
        follower.map(async (follow) => {
          const userfollow = await followService.getFollow(
            userId,
            follow.follower.id,
          );
          const isFollow = userfollow ? true : false;

          return {
            ...follow,
            isFollow,
          };
        }),
      );

      res.json(newFollow);
    } catch (error) {
      next(error);
    }
  }

  async createFollow(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
                      required: true,
                      content: {
                          "application/json": {
                              schema: {
                                  $ref: "#/components/schemas/CreateFollowDTO"
                              }  
                          }
                      }
                  } 
              */

    try {
      const body = req.body;

      const { followedId, followingId } =
        await createFollowSchema.validateAsync(body);

      await followService.createFollow(followedId, followingId);
      res.json({
        message: 'followed success!',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFollow(req: Request, res: Response, next: NextFunction) {
    try {
      const { followedId, followingId } = req.params;

      const follow = await followService.getFollow(followedId, followingId);

      if (!follow) {
        res.status(404).json({
          message: 'Follow not found!',
        });
        return;
      }

      await followService.deleteFollow(follow.id);
      res.json({
        message: 'Unfollow success!',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new FollowController();
