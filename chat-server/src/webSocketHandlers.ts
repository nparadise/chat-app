import { Message } from './models/messageModel';
import { WebSocket } from 'ws';

const onlineUsers = new Map<WebSocket, string>();

export function handleJoin(ws: WebSocket, username: string) {
  onlineUsers.set(ws, username);
  broadcastUserList();
}

export async function handleChatMessage(ws: WebSocket, decoded: { id: string; username: string }, text: string) {
  const newMessage = new Message({ sender: decoded.id, content: text });
  try {
    await newMessage.save();
    broadcast({ type: 'message', username: decoded.username, text });
  } catch (error) {
    console.log('메시지 저장 실패:', (error as Error).message);
    ws.send(JSON.stringify({ type: 'error', message: '메시지 저장 실패' }));
  }
}

export function handleClose(ws: WebSocket) {
  onlineUsers.delete(ws);
  broadcastUserList();
  console.log('클라이언트 연결 종료');
}

export function broadcast(data: object) {
  console.log('OUT:', data);
  onlineUsers.forEach((_, ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  });
}

export function broadcastUserList() {
  const userList = Array.from(onlineUsers.values());
  broadcast({ type: 'onlineUsers', users: userList });
}
