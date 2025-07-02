import express from 'express';
import followController from '../controllers/follow-controller';
import { authCheck } from '../middlewares/auth-middleware';
import { RateLimit } from '../middlewares/rate-limit-middlewares';

const router = express.Router();

router.use(RateLimit('follow'));

router.get('/following/:followedId', authCheck, followController.getFollowing);
router.get('/follower/:followingId', authCheck, followController.getFollower);
router.post('/', authCheck, followController.createFollow);
router.delete(
  '/:followedId/:followingId',
  authCheck,
  followController.deleteFollow,
);

export default router;
