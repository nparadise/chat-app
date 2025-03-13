import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import http from 'http';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './config/database';
import { Message } from './models/messageModel';

import authRoutes from './routers/authRoutes';
import chatRoutes from './routers/chatRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

connectDB();

wss.on('connection', (ws: WebSocket, req) => {
  const cookies = req.headers.cookie;
  const token = cookies
    ?.split('; ')
    .find((c) => c.startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    ws.close();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
    console.log('인증된 사용자:', decoded);

    ws.on('message', async (message) => {
      const newMessage = new Message({ sender: decoded.userId, content: message });
      await newMessage.save();

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`${decoded.username}: ${message}`);
        }
      });
    });
  } catch (error) {
    ws.close();
  }

  ws.on('close', () => {
    console.log('클라이언트 연결 종료');
  });
});

server.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
