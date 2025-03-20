import { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext<{
  ws: WebSocket | null;
  isConnected: boolean;
} | null>(null);

export const WebSocketProvider = ({ children }: React.PropsWithChildren) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let socket: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      socket = new WebSocket("wss://localhost:5000");

      socket.onopen = () => {
        console.log("WebSocket 연결");
        setIsConnected(true);
        socket.send(JSON.stringify({ type: "join" }));
      };

      socket.onclose = () => {
        console.log("WebSocket 연결 종료");
        setIsConnected(false);
        reconnectTimeout = setTimeout(connect, 5000); // 5초 후 재연결
      };

      socket.onerror = (error) => {
        console.error("WebSocket 에러 발생:", error);
      };

      setWs(socket);
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      console.log("WebSocket 연결 종료 중...");
      socket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ ws, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("WebSocketContext가 제공되지 않았습니다.");
  return context;
};
