import express from 'express';
import { getMe, login, logout, register } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddlewares';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// 로그인 상태 확인
router.get('/me', authenticate, getMe);

export default router;
