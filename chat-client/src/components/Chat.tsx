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
    <div className="my-4 max-h-[calc(100dvh-8rem)] max-w-md">
      <h2 className="mb-2 text-xl font-bold">실시간 채팅</h2>
      <div className="mb-2 h-11/12 min-h-60 min-w-xs space-y-2 overflow-auto border p-2">
        {messages.map((message, index, arr) => (
          <>
            {message.username !== "alert" &&
            (index === 0 || arr[index - 1].username !== message.username) ? (
              <p
                key={`${index}-${message.username}`}
                className="mb-1 w-fit rounded-sm text-black dark:text-white"
              >
                {message.username}
              </p>
            ) : (
              ""
            )}
            <p
              key={index}
              className={
                message.username === "alert"
                  ? "mx-auto w-fit text-sm text-neutral-300"
                  : "w-fit rounded-sm bg-neutral-800 px-2 py-1 text-white"
              }
            >
              {message.text}
            </p>
          </>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onPressEnter}
        placeholder="내용을 입력하세요"
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
