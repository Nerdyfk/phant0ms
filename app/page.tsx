"use client";

import { useState } from "react";

export default function HomePage() {
  const [wallet, setWallet] = useState("");
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!wallet) {
      setMessage("Wallet address required");
      return;
    }

    const res = await fetch("/api/whitelist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet }),
    });

    const data = await res.json();
    setMessage(res.ok ? "Whitelisted ✅" : data.error || "Error ❌");
    setWallet("");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-6 border border-gray-700 rounded">
        <h1 className="text-2xl mb-4 text-center">Join Whitelist</h1>

        <input
          className="w-full p-2 mb-3 text-black"
          placeholder="Wallet address"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-purple-600 py-2"
        >
          Submit
        </button>

        {message && (
          <p className="mt-3 text-center">{message}</p>
        )}
      </div>
    </main>
  );
}
