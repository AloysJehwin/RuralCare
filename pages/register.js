import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", dob: "", height: "", weight: "" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", form);
      alert("Registration successful!");
      router.push("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
      <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-xl p-8 w-full max-w-md text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" placeholder="John Doe" required 
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-300"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" placeholder="johndoe@example.com" required 
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-300"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" placeholder="********" required 
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-300"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input type="date" required 
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:ring-2 focus:ring-blue-300"
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Height (cm)</label>
              <input type="number" placeholder="170" required 
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-300"
                onChange={(e) => setForm({ ...form, height: e.target.value })}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Weight (kg)</label>
              <input type="number" placeholder="70" required 
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-300"
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" 
            className="w-full p-3 mt-4 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white font-semibold text-lg transition-all duration-200">
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-white/80">
          Already have an account? <a href="/login" className="text-blue-300 hover:text-blue-400">Login</a>
        </p>
      </div>
    </div>
  );
}
