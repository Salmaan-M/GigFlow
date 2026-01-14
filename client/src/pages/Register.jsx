import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";


export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Account created successfully!");
      navigate("/");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="card w-full max-w-md bg-white p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
            <p className="text-gray-500">Join GigFlow to start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              className="btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-black font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
