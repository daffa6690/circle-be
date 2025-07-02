import { Request, Response, NextFunction } from 'express';

const testController = {
  async test(req: Request, res: Response, next: NextFunction) {
    res.json({ message: 'Hello World' });
  },
};

export default testController;