import { useEffect, useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000");

    socket.onopen = () => {
      console.log("WebSocket 연결됨");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    socket.onclose = () => {
      console.log("WebSocket 연결 종료");
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && input.trim()) {
      ws.send(input);
      setInput("");
    }
  };

  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <h2 className="mb-2 text-xl font-bold">실시간 채팅</h2>
      <div className="mb-2 min-h-60 overflow-auto border p-2">
        {messages.map((message, index) => (
          <p key={index} className="my-1 rounded bg-neutral-800 p-1 text-white">
            {message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onPressEnter}
        className="w-full border p-2"
      />
      <button
        type="button"
        onClick={sendMessage}
        className="my-2 w-full bg-blue-500 p-2 text-white"
      >
        전송
      </button>
    </div>
  );
};

export default Chat;
