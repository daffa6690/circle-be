import express from 'express';
import likeController from '../controllers/like-controller';
import { authCheck } from '../middlewares/auth-middleware';
import { RateLimit } from '../middlewares/rate-limit-middlewares';

const router = express.Router();

// router.use(RateLimit('like'));

router.post('/thread', authCheck, likeController.createLikeThread);
router.delete('/thread/:threadId', authCheck, likeController.deleteLikeThread);
router.post('/reply', authCheck, likeController.createLikeReply);
router.delete('/reply/:replyId', authCheck, likeController.deleteLikeReply);

export default router;
