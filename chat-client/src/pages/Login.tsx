import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = formData;

    try {
      const errorMessage = await login(username, password);
      setErrorMessage(errorMessage);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="box-content w-xs space-y-4 rounded-sm bg-white p-4 shadow-lg dark:bg-neutral-800 dark:text-white"
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
          className="block w-full rounded-xs bg-neutral-200 p-2 text-black outline-blue-700"
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
          className="block w-full rounded-xs bg-neutral-200 p-2 text-black outline-blue-700"
        />
      </div>
      {errorMessage !== "" ? (
        <p className="w-full text-wrap text-red-600">{errorMessage}</p>
      ) : null}
      <button
        type="submit"
        className="mx-auto block rounded-sm bg-blue-700 px-4 py-1.5 font-bold text-white"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
