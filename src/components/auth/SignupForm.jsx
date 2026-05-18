import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignupForm({ setOpen }) {
  const { signup, loading } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await signup(
      form.name,
      form.email,
      form.password
    );

    if (response.success) {
      toast.success("Account created successfully 🎉");

      setOpen(false);

      navigate("/dashboard");
    } else {
      toast.error(response.message || "Signup failed ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <input
        type="text"
        name="name"
        placeholder="Name"
        className="w-full p-4 rounded-xl bg-white/10 outline-none border border-white/10 focus:border-cyan-400"
        onChange={handleChange}
        required
      />

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full p-4 rounded-xl bg-white/10 outline-none border border-white/10 focus:border-cyan-400"
        onChange={handleChange}
        required
      />

      {/* Password */}
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full p-4 rounded-xl bg-white/10 outline-none border border-white/10 focus:border-cyan-400"
        onChange={handleChange}
        required
      />

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}

export default SignupForm;