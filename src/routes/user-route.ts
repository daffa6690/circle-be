import express, { Request, Response } from 'express';
import prisma from '../libs/prima';
import userController from '../controllers/user-controller';
import { authCheck } from '../middlewares/auth-middleware';
import { upload } from '../middlewares/upload-middleware';

const router = express.Router();

router.get('/', authCheck,  userController.getUsers);
router.get('/search', authCheck, userController.getUserSearch);
router.post('/', userController.createUser);
router.get('/:id', authCheck, userController.getUserById);
router.get('/suggest', userController.getUsersSuggest);
router.delete('/:id', userController.deleteUserById);
router.patch('/:id', userController.updateUserById);
router.patch(
  '/profile/:userId',
  authCheck,

  upload.fields([{ name: 'avatarUrl' }, { name: 'bannerUrl' }]),

  userController.updateprofileByUserId,
);

export default router;
