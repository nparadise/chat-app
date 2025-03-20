import axios from "axios";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  checkAuth(): Promise<void>;
  login(
    username: string,
    password: string,
  ): Promise<{ success: boolean; message: string }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get("/auth/me", { withCredentials: true });
      if (res.status !== 200) throw new Error(res.data.message);

      const userData = (await res.data) as User;
      setUser(userData);
    } catch (error) {
      setUser(null);
      console.error("인증 확인 중 오류 발생:", error);
    }
  }, []);

  const login = useCallback(
    async (
      username: string,
      password: string,
    ): Promise<{ success: boolean; message: string }> => {
      setLoading(true);

      try {
        // 로그인 요청
        const res = await axios.post<{ message: string }>(
          "/auth/login",
          { username, password },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          },
        );

        // 로그인 성공 시 인증 정보 갱신 및 index 페이지로 이동
        if (res.status === 200) {
          checkAuth();
          navigate("/");
          return { success: true, message: res.data.message };
        } else {
          return { success: false, message: res.data.message };
        }
      } catch (error) {
        console.error("로그인 중 오류 발생", error);
        return { success: false, message: "로그인 중 서버 오류 발생했습니다." };
      } finally {
        setLoading(false);
      }
    },
    [navigate, checkAuth],
  );

  useEffect(() => {
    setLoading(true);
    checkAuth();
    setLoading(false);
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, setUser, checkAuth, login, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext 사용 오류");
  return context;
};
