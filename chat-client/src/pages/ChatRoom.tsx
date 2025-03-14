import { useAuth } from "@contexts/AuthContext";

import Chat from "@components/Chat";
import OnlineUsers from "@components/OnlineUsers";

const ChatRoom = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center justify-center">
      <OnlineUsers />
      <Chat />
    </div>
  );
};

export default ChatRoom;
