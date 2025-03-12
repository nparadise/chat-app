import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const router = express.Router();

// 회원가입
router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: '이미 존재하는 사용자입니다' });
      return;
    }
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: '회원가입 성공' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
});

// 로그인
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: '비밀번호가 일치하지 않습니다. ' });
    }

    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    res.json({ message: '로그인 성공', token });
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;
