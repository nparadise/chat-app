import { useState } from "react";

import useChat from "@hooks/useChat";

const Chat = () => {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <h2 className="mb-2 text-xl font-bold">실시간 채팅</h2>
      <div className="mb-2 min-h-60 min-w-xs overflow-auto border p-2">
        {messages.map((message, index) => (
          <p key={index} className="my-1 rounded bg-neutral-800 p-1 text-white">
            {message.username}: {message.text}
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
        onClick={handleSendMessage}
        className="my-2 w-full bg-blue-500 p-2 text-white"
      >
        전송
      </button>
    </div>
  );
};

export default Chat;
