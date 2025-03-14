import { useEffect } from "react";

import { useWebSocket } from "@contexts/ChatContext";

import useOnlineUsers from "@hooks/useOnlineUsers";

const OnlineUsers = () => {
  const ws = useWebSocket();
  const { onlineUsers, refresh } = useOnlineUsers();

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Interval");
      if (!ws || ws.readyState === ws.CONNECTING) return;
      refresh();
      clearInterval(intervalId);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [ws, refresh]);

  return (
    <div>
      <h2 className="mb-2 text-xl font-bold">채팅 참가자</h2>
      <ul className="min-h-60 min-w-48 border border-neutral-200">
        {onlineUsers.map((user) => (
          <li key={user} className="text-white">
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
