import { useAuth } from "@contexts/AuthContext";

import Chat from "@components/Chat";
import OnlineUsers from "@components/OnlineUsers";

const ChatRoom = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-4 max-h-full flex-col justify-center sm:flex sm:flex-row sm:gap-4">
      <OnlineUsers />
      <Chat />
    </div>
  );
};

export default ChatRoom;
