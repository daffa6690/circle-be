import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authCheck(req: Request, res: Response, next: NextFunction) {
  const jwtSecret = process.env.JWT_SECRET || '';

  // 1. Ambil token dari cookie atau header
  let token = '';

  // Jika ada di cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Jika tidak ada di cookie, cek Authorization header
  if (!token && req.headers['authorization']) {
    const authHeader = req.headers['authorization'];
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const user = jwt.verify(token, jwtSecret);
    (req as any).user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}
