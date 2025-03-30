import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", form);
      alert("Registration successful!");
      router.push("/login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input type="text" placeholder="Name" required className="mb-2 p-2 border" onChange={(e) => setForm({...form, name: e.target.value})} />
        <input type="email" placeholder="Email" required className="mb-2 p-2 border" onChange={(e) => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Password" required className="mb-2 p-2 border" onChange={(e) => setForm({...form, password: e.target.value})} />
        <button type="submit" className="bg-blue-500 text-white p-2">Register</button>
      </form>
    </div>
  );
}
