import { useCallback, useEffect, useMemo, useState } from "react";

import { useWebSocket } from "@contexts/ChatContext";

const useChat = () => {
  const { ws, isConnected } = useWebSocket();
  const [messages, setMessages] = useState<
    { username: string; text: string }[]
  >([]);
  const isMessageExist = useMemo(() => messages.length > 0, [messages]);

  useEffect(() => {
    if (!ws) return;

    const handleChatMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "message" && data.username && data.text) {
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

  useEffect(() => {
    if (!isConnected) {
      if (isMessageExist) {
        setMessages((prev) => [
          ...prev,
          {
            username: "alert",
            text: "채팅 서버 연결이 끊어졌습니다.",
          },
        ]);
      }
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        username: "alert",
        text: "채팅 서버에 연결되었습니다.",
      },
    ]);
  }, [isConnected, isMessageExist]);

  const sendMessage = useCallback(
    (text: string) => {
      if (ws && isConnected) {
        ws.send(JSON.stringify({ type: "message", text }));
      } else {
        console.error("WebSocket이 연결되지 않았습니다.");
      }
    },
    [ws, isConnected],
  );

  return { messages, sendMessage };
};

export default useChat;
