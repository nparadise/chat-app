import { BrowserRouter, Route, Routes } from "react-router";

import { AuthProvider } from "@contexts/AuthContext";
import { WebSocketProvider } from "@contexts/ChatContext";

import MainLayout from "@layouts/MainLayout";

import ChatRoom from "@pages/ChatRoom";
import Login from "@pages/Login";
import Register from "@pages/Register";

import ProtectedRoute from "@components/ProtectedRoute";

import App from "@/App";

const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<App />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route
                path="/chat"
                element={
                  <WebSocketProvider>
                    <ChatRoom />
                  </WebSocketProvider>
                }
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;
