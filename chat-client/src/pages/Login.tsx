import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = formData;

    try {
      const res = await axios.post(
        "/auth/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      if (res.status === 200) {
        navigate("/");
        return;
      }
      setErrorMessage(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={login}
      className="box-content w-xs p-4 space-y-4 rounded-sm shadow-lg bg-white dark:bg-neutral-800 dark:text-white"
    >
      <h2 className="text-center text-2xl font-bold">Login</h2>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="block w-full p-2 rounded-xs outline-blue-700 bg-neutral-200 text-black"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="block w-full p-2 rounded-xs outline-blue-700 bg-neutral-200 text-black"
        />
      </div>
      {errorMessage !== "" ? (
        <p className="w-full text-red-600 text-wrap">{errorMessage}</p>
      ) : null}
      <button
        type="submit"
        className="block mx-auto px-4 py-1.5 rounded-sm bg-blue-700 text-white font-bold"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
