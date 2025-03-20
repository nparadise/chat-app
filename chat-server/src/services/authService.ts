import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { User } from '../models/userModel';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
}

interface ServiceReturn<T = unknown> {
  success: boolean;
  message: string;
  status: number;
  data?: T;
}

export const register = async (username: string, password: string): Promise<ServiceReturn> => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return { success: false, message: '이미 존재하는 사용자입니다.', status: 400 };
  }

  try {
    const user = new User({ username, password });
    await user.save();
    return { success: true, message: '회원가입 성공', status: 201 };
  } catch (error) {
    console.error('회원가입 중 오류 발생:', error);
    return { success: false, message: '회원가입 중 오류 발생.', status: 500 };
  }
};

export const login = async (username: string, password: string): Promise<ServiceReturn<string>> => {
  let user;
  try {
    user = await User.findOne({ username });
    if (!user) {
      return { success: false, status: 400, message: '사용자를 찾을 수 없습니다.' };
    }
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    return { success: false, status: 500, message: '로그인 중 서버 오류 발생' };
  }

  try {
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return { success: false, status: 400, message: '비밀번호가 일치하지 않습니다.' };
    }
  } catch (error) {
    console.error('비밀번호 비교 중 오류 발행:', error);
    return { success: false, status: 500, message: '비밀번호 비교 중 서버 오류 발생' };
  }

  const payload = { id: user._id, username: user.username };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  return { success: true, status: 200, message: '로그인 성공', data: token };
};

export const getMe = async (id: string): Promise<ServiceReturn<{ id: string; username: string }>> => {
  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return { success: false, status: 404, message: '사용자를 찾을 수 없습니다.' };
    }
    return { success: true, status: 200, message: '세션 확인 성공', data: { id: user.id, username: user.username } };
  } catch (error) {
    console.error('사용자 확인 중 오류 발생:', error);
    return { success: false, status: 500, message: '사용자 확인 중 서버 오류 발생' };
  }
};
