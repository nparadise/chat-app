import { Request, Response } from 'express';
import dotenv from 'dotenv';

import { AuthRequest } from '../middlewares/authMiddlewares';
import * as authService from '../services/authService';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
}

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { status, message } = await authService.register(username, password);

  res.status(status).json({ message });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { status, message, data: token } = await authService.login(username, password);

  res.status(status).json({ message, token });
};

export const logout = async (_: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: '로그아웃 성공' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
    return;
  }
  const { status, message, data: user } = await authService.getMe(req.user.id);
  res.status(status).json({ message, user });
};
