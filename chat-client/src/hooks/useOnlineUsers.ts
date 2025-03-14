import { useCallback, useEffect, useState } from "react";

import { useWebSocket } from "@contexts/ChatContext";

const useOnlineUsers = () => {
  const ws = useWebSocket();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!ws) return;

    const handleOnlineUsers = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "onlineUsers") {
        setOnlineUsers(data.users);
      }
    };

    ws.addEventListener("message", handleOnlineUsers);

    return () => {
      ws.removeEventListener("message", handleOnlineUsers);
    };
  }, [ws]);

  const refresh = useCallback(() => {
    if (ws) {
      ws.send(JSON.stringify({ type: "onlineUsers" }));
    }
  }, [ws]);

  return { onlineUsers, refresh };
};

export default useOnlineUsers;
