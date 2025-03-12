import { useEffect, useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onopen = () => {
      console.log('WebSocket 연결됨');
      setWs(socket);
    };

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    socket.onclose = () => {
      console.log('WebSocket 연결 종료');
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && input.trim()) {
      ws.send(input);
      setInput('');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">실시간 채팅</h2>
      <div className="border p-2 h-40 overflow-auto mb-2">
        {messages.map((message, index) => (
          <p key={index} className="bg-gray-200 p-1 rounded my-1">
            {message}
          </p>
        ))}
      </div>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="border p-2 w-full" />
      <button type="button" onClick={sendMessage} className="bg-blue-500 text-white p-2 my-2 w-full">
        전송
      </button>
    </div>
  );
};

export default Chat;
