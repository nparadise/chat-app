import axios from "axios";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  checkAuth(): Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

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

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext 사용 오류");
  return context;
};
