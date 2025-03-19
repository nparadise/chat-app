import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import https from 'https';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';

import { connectDB } from './config/database';
import { Message } from './models/messageModel';

import authRoutes from './routers/authRoutes';
import chatRoutes from './routers/chatRoutes';

dotenv.config();

interface ConnectedUser {
  ws: WebSocket;
  username: string;
}

type WebSocketMessage = TypeOnlyMessage | ChatMessage;

interface TypeOnlyMessage {
  type: 'join' | 'onlineUsers';
}

interface ChatMessage {
  type: 'message';
  text: string;
}

const options = {
  key: fs.readFileSync('../key.pem'),
  cert: fs.readFileSync('../cert.pem'),
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

const onlineUsers = new Map<WebSocket, string>();

wss.on('connection', (ws: WebSocket, req) => {
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
          await handleMessage(ws, decoded, parsedMessage.text);
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

  ws.on('close', () => {
    onlineUsers.delete(ws);
    broadcastUserList();
    console.log('클라이언트 연결 종료');
  });
});

function handleJoin(ws: WebSocket, username: string) {
  onlineUsers.set(ws, username);
  broadcastUserList();
}

async function handleMessage(ws: WebSocket, decoded: { id: string; username: string }, text: string) {
  const newMessage = new Message({ sender: decoded.id, content: text });
  try {
    await newMessage.save();
    broadcast({ type: 'message', username: decoded.username, text });
  } catch (error) {
    console.log('메시지 저장 실패:', (error as Error).message);
    ws.send(JSON.stringify({ type: 'error', message: '메시지 저장 실패' }));
  }
}

function broadcast(data: object) {
  console.log('OUT:', data);
  onlineUsers.forEach((_, ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  });
}

function broadcastUserList() {
  const userList = Array.from(onlineUsers.values());
  broadcast({ type: 'onlineUsers', users: userList });
}

server.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
