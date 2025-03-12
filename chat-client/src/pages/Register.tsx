import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 다릅니다.");
      return;
    }

    if (!username || username.length < 3) {
      setErrorMessage("사용자 이름은 최소 3자 이상이어야 합니다.");
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage("비밀번호는 최소 4자 이상이어야 합니다.");
      return;
    }

    const { data, status } = await axios.post(
      "/auth/register",
      {
        username,
        password,
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      },
    );

    if (status === 201) {
      navigate("/");
    } else {
      setErrorMessage(data.message);
    }
  };

  return (
    <form
      onSubmit={signup}
      className="box-content w-xs p-4 space-y-4 rounded-sm shadow-lg bg-white dark:bg-neutral-800 dark:text-white"
    >
      <h2 className="text-center text-2xl font-bold">Sign Up</h2>
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
      <div>
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          name="confirmPassword"
          value={formData.confirmPassword}
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
        Sign Up
      </button>
    </form>
  );
};

export default Register;
