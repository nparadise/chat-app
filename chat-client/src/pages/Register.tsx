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
    <div className="flex size-full items-center justify-center">
      <form
        onSubmit={signup}
        className="box-content w-xs space-y-4 rounded-sm bg-white p-4 shadow-lg dark:bg-neutral-800 dark:text-white"
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
        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
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
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
