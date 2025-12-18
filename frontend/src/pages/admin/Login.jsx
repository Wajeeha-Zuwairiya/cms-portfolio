import { useForm } from "react-hook-form";
import api from "../../api/api";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../index.css";

const Login = () => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const { setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.login(data);
      setAuthenticated(true);
      toast.success("Logged in successfully");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Invalid credentials");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-cyan-700 overflow-hidden">

      {/* Decorative background circles */}
      <div className="absolute w-96 h-96 bg-white/10 rounded-full top-[-10%] left-[-10%] animate-pulse-slow"></div>
      <div className="absolute w-96 h-96 bg-white/20 rounded-full bottom-[-10%] right-[-10%] animate-pulse-slow delay-2000"></div>

      {/* Login form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 bg-black/30 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-md text-white flex flex-col space-y-6 animate-slideIn"
      >
        <h1 className="text-4xl font-extrabold text-center text-white drop-shadow-lg">
          Admin Login
        </h1>

        {/* Email Field */}
        <div className="relative w-full">
          <input
            type="email"
            autoComplete="email"
            {...register("email", { required: true })}
            className="peer w-full bg-transparent border-b-2 border-white/50 text-white py-3 px-1 placeholder-transparent focus:outline-none focus:border-cyan-400 transition"
            placeholder="Email"
          />
          <label className="absolute left-1 -top-2.5 text-white text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-white/70 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-white peer-focus:text-sm">
            Email
          </label>
          {/* Always visible dash */}
          <span className="absolute left-0 bottom-0 h-[2px] w-full bg-white/50"></span>
          {/* Focused animation dash */}
          <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-400 peer-focus:w-full transition-all"></span>
        </div>

        {/* Password Field */}
        <div className="relative w-full">
          <input
            type="password"
            autoComplete="current-password"
            {...register("password", { required: true })}
            className="peer w-full bg-transparent border-b-2 border-white/50 text-white py-3 px-1 placeholder-transparent focus:outline-none focus:border-cyan-400 transition"
            placeholder="Password"
          />
          <label className="absolute left-1 -top-2.5 text-white text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-white/70 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-white peer-focus:text-sm">
            Password
          </label>
          <span className="absolute left-0 bottom-0 h-[2px] w-full bg-white/50"></span>
          <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-400 peer-focus:w-full transition-all"></span>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 bg-cyan-500 hover:bg-cyan-600 font-bold text-lg rounded-xl shadow-lg transition-transform transform hover:scale-105 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
