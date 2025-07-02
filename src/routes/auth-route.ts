import express from 'express';
import userController from '../controllers/auth-controller';
import { authCheck } from '../middlewares/auth-middleware';

const router = express.Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/check', authCheck, userController.check);
router.post('/forgot-password', userController.forgot);
router.post('/reset-password', authCheck, userController.reset);

export default router;
