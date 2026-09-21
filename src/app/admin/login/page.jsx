"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Login failed");
    router.push("/admin");
  }

  return (
    <main className="section">
      <div className="container" style={{maxWidth:480}}>
        <div className="card">
          <h1 style={{fontSize:"2rem"}}>Admin Login</h1>
          <form className="form" onSubmit={submit}>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
            <button className="btn btn-primary">Login</button>
          </form>
          {error && <p style={{color:"crimson"}}>{error}</p>}
        </div>
      </div>
    </main>
  );
}