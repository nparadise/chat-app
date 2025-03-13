import axios from "axios";
import {
  createContext,
  PropsWithChildren,
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
  login(username: string, password: string): Promise<string>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const checkAuth = async () => {
    try {
      const res = await axios.get("/auth/me", { withCredentials: true });
      if (res.status !== 200) throw new Error(res.data.message);

      const userData = (await res.data) as User;
      setUser(userData);
    } catch (error) {
      setUser(null);
      console.log(error);
    }
  };

  const login = async (username: string, password: string): Promise<string> => {
    let errorMessage: string = "";
    setLoading(true);

    try {
      const res = await axios.post(
        "/auth/login",
        { username, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      if (res.status === 200) {
        checkAuth();
        navigate("/");
      } else {
        errorMessage = res.data.message;
      }
    } catch (error) {
      errorMessage = `${error}`;
    }
    setLoading(false);
    return errorMessage;
  };

  useEffect(() => {
    setLoading(true);
    checkAuth();
    setLoading(false);
  }, []);

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
