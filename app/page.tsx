"use client";

import { useState } from "react";

export default function Home() {
  const [submittedTwitter, setSubmittedTwitter] = useState<string | null>(null);
  const [twitter, setTwitter] = useState("");
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<null | {
    whitelisted: boolean;
    approved: boolean;
  }>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkWhitelist() {
    setLoading(true);
    setMessage("");
    setResult(null);

    const res = await fetch("/api/whitelist/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  async function joinWhitelist() {
    setLoading(true);
    setMessage("");
    setResult(null);

    const res = await fetch("/api/whitelist/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Address submitted successfully");
     setSubmittedTwitter(twitter);  
  } else {
      setMessage(data.message || "Already submitted");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Phant0ms Whitelist</h1>

        <input
          type="text"
          placeholder="Paste your wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-3 rounded bg-gray-900 border border-gray-700 outline-none"
        />
        <input
  type="text"
  placeholder="Twitter username (without @)"
  value={twitter}
  onChange={(e) => setTwitter(e.target.value)}
  className="w-full px-4 py-3 rounded bg-gray-900 border border-gray-700 outline-none"
/>

        <div className="flex gap-2">
          <button
            onClick={checkWhitelist}
            disabled={loading || !address}
            className="w-full py-3 bg-purple-600 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check"}
          </button>

          <button
            onClick={joinWhitelist}
            disabled={loading || !address}
            className="w-full py-3 bg-green-600 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Join"}
          </button>
        </div>

        {message && <p className="text-center">{message}</p>}

        {submittedTwitter && (
  <p className="text-center text-blue-400">
    Submitted as @{submittedTwitter}
  </p>
)}

        {result && (
          <div className="text-center">
            {result.whitelisted ? (
              <p className="text-green-400">
                ✅ Whitelisted
                {!result.approved && " (Pending approval)"}
              </p>
            ) : (
              <p className="text-red-400">❌ Not whitelisted</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
