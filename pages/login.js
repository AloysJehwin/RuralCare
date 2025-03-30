import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/login", form);
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      router.push("/");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input type="email" placeholder="Email" required className="mb-2 p-2 border" onChange={(e) => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Password" required className="mb-2 p-2 border" onChange={(e) => setForm({...form, password: e.target.value})} />
        <button type="submit" className="bg-green-500 text-white p-2">Login</button>
      </form>
    </div>
  );
}
