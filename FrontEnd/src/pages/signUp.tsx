import { useState } from "react";
import { apiClient } from "../apiClient";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isStrongPassword = (pwd: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pwd);
  };

  const validate = () => {
    let valid = true;
    setPasswordError("");
    setRepeatPasswordError("");
    setError("");

    if (!isStrongPassword(password)) {
      setPasswordError(
        "The password must be at least 8 characters long, contain an uppercase letter, a number, and a special character."
      );
      valid = false;
    }

    if (password !== repeatPassword) {
      setRepeatPasswordError("Passwords do not match.");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const body = { name, email, password };
      const response = await apiClient.post("/auth/register", body);
      if (response.status === 201) {
        navigate("/signIn");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unexpected Error. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center bg-gray-200">
      <div className="flex bg-white w-11/12 max-w-[1000px] h-[600px] rounded-2xl overflow-hidden gap-y-7">
        <form
          className="w-1/2 flex flex-col items-center gap-5 pt-15"
          onSubmit={handleSubmit}
        >
          <p className="self-center text-3xl">Welcome</p>

          <div className="flex flex-col w-6/7">
            <label>Name</label>
            <input
              type="text"
              className="border border-gray-400 rounded h-11 p-4 focus:outline-none focus:ring-1 focus:ring-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-6/7">
            <label>Email</label>
            <input
              type="email"
              className="border border-gray-400 rounded h-11 p-4 focus:outline-none focus:ring-1 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-6/7 relative">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className={`border border-gray-400 rounded h-11 p-4 pr-12 focus:outline-none focus:ring-1 focus:ring-primary ${
                passwordError ? "border-red-500 focus:ring-red-500" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="cursor-pointer absolute right-3 top-[38px] text-sm text-primary hover:text-primary-dark transition"
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <div className="flex flex-col w-6/7 relative">
            <label>Repeat Password</label>
            <input
              type={showRepeatPassword ? "text" : "password"}
              className={`border border-gray-400 rounded h-11 p-4 pr-12 focus:outline-none focus:ring-1 focus:ring-primary ${
                repeatPasswordError ? "border-red-500 focus:ring-red-500" : ""
              }`}
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowRepeatPassword((prev) => !prev)}
              className="cursor-pointer absolute right-3 top-[38px] text-sm text-primary hover:text-primary-dark transition"
              tabIndex={-1}
            >
              {showRepeatPassword ? "Hide" : "Show"}
            </button>
            {repeatPasswordError && (
              <p className="text-red-500 text-sm mt-1">{repeatPasswordError}</p>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm -mt-4 px-4 text-center">{error}</p>
          )}

          <div className="mt-auto mb-12 flex flex-col items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer border-1-white text-white w-70 h-10 rounded-xl transition duration-300 ${
                loading
                  ? "bg-secondary opacity-70 cursor-not-allowed"
                  : "bg-primary hover:bg-secondary"
              }`}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
            <p className="text-sm opacity-40">
              Already have an account?{" "}
              <Link to="/signIn" className="text-blue-700 cursor-pointer">
                Sign In
              </Link>
            </p>
          </div>
        </form>

        <div className="w-1/2 bg-secondary text-white font-family-garamond flex flex-col items-center justify-around">
          <p className="text-2xl text-center">Begin Your <br /> Learning Experience</p>
          <h1 className="text-6xl text-center leading-18">
            Create, <br /> Share, <br /> Learn
          </h1>
          <p>Where Creativity has no limits</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
