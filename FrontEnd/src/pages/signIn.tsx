import { useState } from "react";
import { apiClient } from "../apiClient";
import { useNavigate, Link } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const body = { email, password };
      const response = await apiClient.post("/auth/login", body);
      if (response.status === 200) {
        navigate("/profile");
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center bg-gray-200">
      <div className="flex bg-white w-11/12 max-w-[1000px] h-[600px] rounded-2xl overflow-hidden gap-y-7">
        <form className="w-1/2 flex flex-col items-center gap-7 pt-15" onSubmit={handleSubmit} noValidate>
          <p className="self-center text-3xl">Sign In</p>

          <div className="flex flex-col w-6/7">
            <label>Email</label>
            <input
              type="email"
              className="border rounded h-11 p-4 focus:outline-none focus:ring-1 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col w-6/7 relative">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="border rounded h-11 p-4 pr-12 focus:outline-none focus:ring-1 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="cursor-pointer absolute right-3 top-[38px] text-sm text-primary hover:text-primary-dark transition"
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-600 text-sm w-6/7 text-center">{errorMessage}</p>
          )}

          <div className="mt-auto mb-12 flex flex-col items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer  w-70 h-10 rounded-xl text-white transition duration-300 ${
                loading
                  ? "bg-secondary opacity-70 cursor-not-allowed"
                  : "bg-primary hover:bg-secondary"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <p className="text-sm opacity-40 mt-2">
              Don't have an account?{" "}
              <Link to="/signUp" className="text-blue-700">
                Create Account
              </Link>
            </p>
          </div>
        </form>

        <div className="w-1/2 bg-secondary text-white font-family-garamond flex flex-col items-center justify-around">
          <p className="text-3xl text-center">Welcome back!</p>
          <h1 className="text-6xl text-center leading-18">
            Create, <br /> Share, <br /> Learn
          </h1>
          <p>Where Creativity has no limits</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
