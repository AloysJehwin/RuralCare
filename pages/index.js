import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Welcome to My App</h1>
      <div className="mt-4">
        <Link href="/login" className="text-blue-500 mr-4">Login</Link>
        <Link href="/register" className="text-green-500">Register</Link>
      </div>
    </div>
  );
}
