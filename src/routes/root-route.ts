import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to circle API');
});
router.delete('/', (req: Request, res: Response) => {
  res.send('Welcome to circle API');
});
router.patch('/', (req: Request, res: Response) => {
  res.send('Welcome to circle API');
});
router.post('/', (req: Request, res: Response) => {
  res.send('Welcome to circle API');
});

export default router;
