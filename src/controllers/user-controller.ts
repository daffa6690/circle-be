import { Request, Response, NextFunction } from 'express';
import userService from '../services/user-service';
import {
  createUserSchema,
  updateProfileSchema,
  updateUserSchema,
} from '../utils/schemas/user-schema';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import followService from '../services/follow-service';
import streamifier from 'streamifier';

class userController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req as any).user.id;

      const users = await userService.getUser(id);
      const newUsers = await Promise.all(
        users.map(async (user) => {
          const userfollow = await followService.getFollow(id, user.id);
          const isFollow = userfollow ? true : false;

          return isFollow
            ? null
            : {
                ...user,
                isFollow,
              };
        }),
      );
      const filteredUsers = newUsers.filter(Boolean);
      res.send(filteredUsers);
    } catch (error) {
      next(error);
    }
  }
  async getUsersSuggest(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUsersSuggest();

      res.send(users);
    } catch (error) {
      next(error);
    }
  }
  async getUsersByFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUsersSuggest();
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
  async getUserSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;

      const userId = (req as any).user.id;
      if (!search.trim()) {
        res.json([]);
        return;
      }

      const users = await userService.getUserSearch(search);

      const newUsers = await Promise.all(
        users.map(async (user) => {
          const userfollow = await followService.getFollow(userId, user.id);
          const isFollow = userfollow ? true : false;

          return {
            ...user,
            isFollow,
          };
        }),
      );
      res.send(newUsers);
    } catch (error) {
      next(error);
    }
  }
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const validated = await createUserSchema.validateAsync(body);
      const user = await userService.createUser(validated);
      res.json(user);
    } catch (error) {
      res.status(400).json((error as any).details);
    }
  }
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const user = await userService.getUserById(id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const userfollow = await followService.getFollow(userId, user.id);
      const isFollow = userfollow ? true : false;

      const followersCount = user?.followings.length;
      const followingsCount = user?.followers.length;
      const newUser = {
        ...user,
        followersCount,
        followingsCount,
        isFollow,
      };

      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }
  async getUserByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;

      const user = await userService.getUserByUsername(username);

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
  async deleteUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.deleteUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
  async updateUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body;

      const user = await userService.getUserById(id);
      if (!user) {
        res.status(404).json({
          message: 'user not found',
        });
        return;
      }

      const { username, email } = await updateUserSchema.validateAsync(body);

      if (email != '') {
        user.email = email;
      }
      if (username != '') {
        user.username = username;
      }
      const updatedUser = await userService.updateUserById(id, user);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
  async updateprofileByUserId(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
    required: true,
    content: {
        "multipart/form-data": {
            schema: {
                $ref: "#/components/schemas/UpdateUserProfileDTO"
            }  
        }
    }
} 
*/

    try {
      const user = (req as any).user.id;
      let avatarUploadResult: string = '';
      let bannerUploadResult: string = '';
      const profile = await userService.getProfileByUserId(user);
      if (!profile) {
        res.status(404).json({
          message: 'user not found',
        });
        return;
      }

      interface MulterFiles {
        avatarUrl?: Express.Multer.File[];
        bannerUrl?: Express.Multer.File[];
      }

      const files = req.files as MulterFiles;

      if (files.avatarUrl && files.avatarUrl.length > 0) {
        avatarUploadResult = await new Promise((resolve, reject) => {
          try {
            if (files.avatarUrl) {
              const stream = cloudinary.uploader.upload_stream(
                {},
                (error, result) => {
                  if (error) return console.error(error);
                  resolve(result?.secure_url || '');
                },
              );
              streamifier
                .createReadStream(files.avatarUrl[0].buffer)
                .pipe(stream);
            }
          } catch (error) {
            reject(error);
          }
        });
      }

      if (files.bannerUrl && files.bannerUrl.length > 0) {
        bannerUploadResult = await new Promise((resolve, reject) => {
          try {
            if (files.bannerUrl) {
              const stream = cloudinary.uploader.upload_stream(
                {},
                (error, result) => {
                  if (error) return console.error(error);
                  resolve(result?.secure_url || '');
                },
              );
              streamifier
                .createReadStream(files.bannerUrl[0].buffer)
                .pipe(stream);
            }
          } catch (error) {
            reject(error);
          }
        });
      }

      const body = {
        ...req.body,
        avatarUrl: avatarUploadResult,
        bannerUrl: bannerUploadResult,
      };

      const validatedData = await updateProfileSchema.validateAsync(body);

      const updatedProfile = await userService.updateProfileByUserId(
        profile.id,
        validatedData,
      );
      res.json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }
}

export default new userController();
