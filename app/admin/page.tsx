"use client";

import { useEffect, useState } from "react";

type Item = {
  id: number;
  address: string;
  twitter?: string;
  approved: boolean;
};

export default function AdminPage() {
  const [list, setList] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPending, setShowPending] = useState(false);

  // security
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);

  async function load() {
    setLoading(true);

    const res = await fetch(
      showPending
        ? "/api/admin/whitelist?pending=true"
        : "/api/admin/whitelist",
      {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      }
    );

    if (res.status === 401) {
      alert("Wrong admin password");
      setAuthorized(false);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setList(data);
    setLoading(false);
  }

  async function toggle(id: number, approved: boolean) {
    await fetch("/api/admin/whitelist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify({ id, approved: !approved }),
    });
    load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this address?")) return;

    await fetch("/api/admin/whitelist", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify({ id }),
    });

    load();
  }

  useEffect(() => {
    if (authorized) load();
  }, [authorized, showPending]);

  /* 🔐 LOGIN SCREEN */
  if (!authorized) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="bg-gray-900 p-6 rounded w-80">
          <h1 className="text-xl font-bold mb-4">Admin Login</h1>

          <input
            type="password"
            placeholder="Admin password"
            className="w-full mb-3 px-3 py-2 bg-black border border-gray-700 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-purple-600 py-2 rounded font-semibold"
            onClick={() => {
              setAuthorized(true);
              load();
            }}
          >
            Enter
          </button>
        </div>
      </main>
    );
  }

  /* 🔑 ADMIN PANEL */
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Admin · Whitelist</h1>

      {/* 🔹 ACTION BAR — ALWAYS VISIBLE */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setShowPending(!showPending)}
          className="px-4 py-2 bg-purple-600 rounded font-semibold"
        >
          {showPending ? "Show All" : "Show Pending Only"}
        </button>

        <button
          onClick={() =>
            fetch("/api/admin/whitelist/export", {
              headers: { Authorization: `Bearer ${password}` },
            }).then((res) =>
              res.blob().then((b) => {
                const url = URL.createObjectURL(b);
                window.open(url);
              })
            )
          }
          className="px-4 py-2 bg-blue-600 rounded font-semibold"
        >
          Export CSV
        </button>

        <label className="px-4 py-2 bg-green-600 rounded font-semibold cursor-pointer">
          Import CSV / Excel
          <input
            type="file"
            accept=".csv,.xlsx"
            hidden
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const buffer = await file.arrayBuffer();

              await fetch("/api/admin/whitelist/import", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${password}`,
                },
                body: buffer,
              });

              alert("Import completed");
              load();
            }}
          />
        </label>
      </div>

      {/* 🔹 LIST SECTION */}
      {loading ? (
        <p>Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-400">No whitelist entries yet.</p>
      ) : (
        <div className="space-y-3">
          {list.map((item) => (
            <div
              key={item.id}
              className="border border-gray-700 rounded p-3 flex justify-between items-center gap-4"
            >
              <div className="flex flex-col text-sm">
                <span className="break-all">{item.address}</span>

                {item.twitter && (
                  <a
                    href={`https://x.com/${item.twitter}`}
                    target="_blank"
                    className="text-blue-400"
                  >
                    @{item.twitter}
                  </a>
                )}

                <div className="text-xs text-gray-400 mt-1">
                  <a
                    href="https://x.com/Phanto0ms"
                    target="_blank"
                    className="underline mr-2"
                  >
                    Check Follow
                  </a>

                  <a
                    href="https://x.com/platform_360/status/2005646202218729975"
                    target="_blank"
                    className="underline mr-2"
                  >
                    Check Like
                  </a>

                  {item.twitter && (
                    <a
                      href={`https://x.com/${item.twitter}`}
                      target="_blank"
                      className="underline"
                    >
                      Check RT
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggle(item.id, item.approved)}
                  className={`px-4 py-1 rounded font-semibold ${
                    item.approved ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {item.approved ? "Revoke" : "Approve"}
                </button>

                <button
                  onClick={() => remove(item.id)}
                  className="px-4 py-1 rounded font-semibold bg-gray-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
