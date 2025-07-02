import express from 'express';
import replyControler from '../controllers/reply-controller';
import { authCheck } from '../middlewares/auth-middleware';

const router = express.Router();

router.get('/:threadId', authCheck, replyControler.getReplyByThreadId);
router.post('/:threadId', authCheck, replyControler.createReply);
router.delete('/:id', authCheck, replyControler.deleteReply);

export default router;
