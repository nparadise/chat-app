import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App";
import MainLayout from "./layouts/MainLayout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ChatRoom from "./pages/ChatRoom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

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
              <Route path="/chat" element={<ChatRoom />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;
