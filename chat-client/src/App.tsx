import axios from "axios";
import { Link, useNavigate } from "react-router";

import { useAuth } from "./contexts/AuthContext";

function App() {
  // TODO: 미인증 상태와 인증 상태에서 다른 모양의 메인 페이지 구현
  const navigate = useNavigate();
  const { user, loading: isLoading } = useAuth();

  const logout = async () => {
    const res = await axios.post("/auth/logout", null, {
      withCredentials: true,
    });
    if (res.status === 200) {
      navigate(0);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex h-full items-center justify-center">
      {user ? (
        <div>
          <p className="animate-appear-from-left font-serif text-2xl">
            Welcome,
          </p>
          <p className="mb-8 animate-appear-from-right font-serif text-5xl">
            {user.username}
          </p>
          <div className="space-x-2 text-center">
            <Link
              to="/chat"
              className="inline-block rounded-sm bg-blue-700 px-2 py-1 hover:bg-blue-800"
            >
              채팅창으로
            </Link>
            <button
              type="button"
              onClick={logout}
              className="cursor-pointer rounded-sm bg-blue-700 px-2 py-1 hover:bg-blue-800"
            >
              로그아웃
            </button>
          </div>
        </div>
      ) : (
        <div className="space-x-2">
          <p className="animate-appear-from-left font-serif text-2xl">
            Welcome,
          </p>
          <p className="mb-6 animate-appear-from-right font-serif text-5xl">
            Guest
          </p>
          <Link
            to="/register"
            className="inline-block rounded-sm bg-blue-700 px-2 py-1 hover:bg-blue-800"
          >
            회원가입
          </Link>
          <Link
            to="/login"
            className="inline-block rounded-sm bg-blue-700 px-2 py-1 hover:bg-blue-800"
          >
            로그인
          </Link>
        </div>
      )}
    </div>
  );
}

export default App;
