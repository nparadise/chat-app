import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import https from 'https';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';

import { connectDB } from './config/database';

import authRoutes from './routers/authRoutes';
import chatRoutes from './routers/chatRoutes';
import { broadcastUserList, handleChatMessage, handleClose, handleJoin } from './webSocketHandlers';

dotenv.config();

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH || '../key.pem'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH || '../cert.pem'),
};

const app = express();
const server = https.createServer(options, app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
}

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'https://localhost:3000',
    credentials: true,
  })
);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

connectDB();

type WebSocketMessage = TypeOnlyMessage | ChatMessage;

interface TypeOnlyMessage {
  type: 'join' | 'onlineUsers';
}

interface ChatMessage {
  type: 'message';
  text: string;
}

// WebSocket 연결 시 이벤트 처리
wss.on('connection', (ws: WebSocket, req) => {
  // 인증 토큰 추출
  const cookies = req.headers.cookie;
  const token = cookies
    ?.split('; ')
    .find((c) => c.startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    console.log('WebSocket 인증 실패: 토큰이 없습니다.');
    ws.close();
    return;
  }

  // JWT 검증
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
    console.log('인증된 사용자:', decoded.username);

    ws.on('message', async (message) => {
      const parsedMessage = JSON.parse(message.toString()) as WebSocketMessage;
      console.log('IN:', parsedMessage);

      switch (parsedMessage.type) {
        case 'join':
          handleJoin(ws, decoded.username);
          break;
        case 'message':
          await handleChatMessage(ws, decoded, parsedMessage.text);
          break;
        case 'onlineUsers':
          broadcastUserList();
          break;
        default:
          console.log('알 수 없는 메시지 타입');
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log('JWT 검증 실패: ', error.message);
    } else {
      console.log(error);
    }
    ws.close();
    return;
  }

  ws.on('close', handleClose);
});

server.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
