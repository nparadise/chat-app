import { useEffect, useState } from "react";

import { useWebSocket } from "@contexts/ChatContext";

import useOnlineUsers from "@hooks/useOnlineUsers";

const OnlineUsers = () => {
  const ws = useWebSocket();
  const { onlineUsers, refresh } = useOnlineUsers();
  const [openUserList, setOpenUserList] = useState(false);

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
    <div className="mt-4 md:my-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">채팅 참가자</h2>
        <button
          type="button"
          className={`cursor-pointer transition-transform sm:hidden ${openUserList ? "rotate-180" : ""}`}
          onClick={() => setOpenUserList((prev) => !prev)}
        >
          ▼
        </button>
      </div>
      <ul
        className={`mt-2 min-w-48 border border-neutral-200 p-2 sm:block sm:min-h-60 ${openUserList ? "" : "hidden"}`}
      >
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
