import { Link, useNavigate } from "react-router";
import { useAuth } from "./contexts/AuthContext";
import axios from "axios";

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
    <>
      {user ? (
        <div>
          <p className="animate-appear-from-left text-3xl">Welcome</p>
          <p className="mb-8 animate-appear-from-right text-5xl">
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
        <div>Without User</div>
      )}
    </>
  );
}

export default App;
