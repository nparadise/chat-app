import { useCallback, useEffect, useState } from "react";

import { useWebSocket } from "@contexts/ChatContext";

const useChat = () => {
  const ws = useWebSocket();
  const [messages, setMessages] = useState<
    { username: string; text: string }[]
  >([]);

  useEffect(() => {
    if (!ws) return;

    const handleChatMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        setMessages((prev) => [
          ...prev,
          { username: data.username, text: data.text },
        ]);
      }
    };

    ws.addEventListener("message", handleChatMessage);

    return () => {
      ws.removeEventListener("message", handleChatMessage);
    };
  }, [ws]);

  const sendMessage = useCallback(
    (text: string) => {
      if (ws) {
        ws.send(JSON.stringify({ type: "message", text }));
      }
    },
    [ws],
  );

  return { messages, sendMessage };
};

export default useChat;
