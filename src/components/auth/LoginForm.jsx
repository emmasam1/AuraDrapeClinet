import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

function LoginForm({ setOpen }) {
  const { login, loading } = useApp();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ---------------- HANDLE SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const response = await login(
      form.email,
      form.password
    );

    if (response.success) {
      setOpen(false);

      navigate("/dashboard");
    } else {
      setError(response.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Email */}
      <input
        type="email"
        name="email"
        value={form.email}
        placeholder="Email"
        className="w-full p-4 rounded-xl bg-white/10 outline-none border border-white/10 focus:border-cyan-400"
        onChange={handleChange}
        required
      />

      {/* Password */}
      <input
        type="password"
        name="password"
        value={form.password}
        placeholder="Password"
        className="w-full p-4 rounded-xl bg-white/10 outline-none border border-white/10 focus:border-cyan-400"
        onChange={handleChange}
        required
      />

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 font-semibold hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default LoginForm;