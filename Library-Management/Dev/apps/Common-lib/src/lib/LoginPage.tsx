import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Styles from "./LoginPage.module.css";

interface LoginData {
  email: string;
  password: string;
}

interface LoginError {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LoginData>({ email: "", password: "" });
  const [error, setError] = useState<LoginError>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let errorMessage = "";

    if (name === "email") {
      if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
        errorMessage = "Please enter a valid email address";
      }
    } else if (name === "password") {
      if (value.length < 6) {
        errorMessage = "Password must be at least 6 characters long";
      }
    }

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError((prevError) => ({
      ...prevError,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const hasError = Object.values(error).some((errorMessage) => errorMessage);
    if (hasError) return;

    setError({ email: "", password: "" });

    try {
      const response = await fetch("http://localhost:14668/api/Users/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const { message } = await response.json();
        setError({ email: "", password: message });
        return;
      }

      const { token, user } = await response.json();
      sessionStorage.setItem("MyToken", token);
      sessionStorage.setItem("UserData", JSON.stringify(user));

      if (user.isAdmin) {
        navigate("/");
      } else {
        navigate("/listbooksuser");
      }
    } catch (error) {
      setError({ email: "", password: "Login failed. Please try again." });
      console.error("Login error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <section className={Styles.LoginPage}>
      <div className={Styles.wrapper}>
        <div className={`${Styles.formbox} ${Styles.login}`}>
          <form onSubmit={handleSubmit}>
            <h1>LOGIN</h1>
            <div className={Styles.inputbox}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className={error.email ? Styles.error : ""}
              />
              <MdOutlineAlternateEmail className={Styles.icon} />
              {error.email && <div className={Styles.error}>{error.email}</div>}
            </div>
            <div className={Styles.inputbox}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={data.password}
                onChange={handleChange}
                className={error.password ? Styles.error : ""}
              />
              <span onClick={togglePasswordVisibility} className={Styles.icon}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {error.password && <div className={Styles.error}>{error.password}</div>}
            </div>
            <button
              type="submit"
              className={Styles.addbooksbtn}
              disabled={Object.values(error).some((errorMessage) => errorMessage)}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
