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

let onlineUsers: ConnectedUser[] = [];

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
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
    console.log('인증된 사용자:', decoded);

    ws.on('message', async (message) => {
      const parsedMessage = JSON.parse(message.toString()) as WebSocketMessage;
      console.log('IN:', parsedMessage);

      if (parsedMessage.type === 'join') {
        onlineUsers.push({ ws, username: decoded.username });
        broadcastUserList();
      } else if (parsedMessage.type === 'message') {
        const newMessage = new Message({ sender: decoded.id, content: parsedMessage.text });
        try {
          await newMessage.save();
        } catch (error) {
          console.log('mongoose error:', error);
        }

        const messageData = {
          type: 'message',
          username: decoded.username,
          text: parsedMessage.text,
        };

        broadcast(messageData);
      } else if (parsedMessage.type === 'onlineUsers') {
        broadcastUserList();
      }
    });
  } catch (error) {
    console.log(error);
  }

  ws.on('close', () => {
    onlineUsers = onlineUsers.filter((user) => user.ws !== ws);
    broadcastUserList();
    console.log('클라이언트 연결 종료');
  });
});

function broadcast(data: object) {
  console.log('OUT:', data);
  onlineUsers.forEach((user) => user.ws.send(JSON.stringify(data)));
}

function broadcastUserList() {
  const userList = onlineUsers.map((user) => user.username);
  broadcast({ type: 'onlineUsers', users: userList });
}

server.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
