import { prisma } from "@/lib/prisma";
import ImportFiles from "./import-files";

export const runtime = "nodejs";

export default async function AdminPage() {
  const whitelist = await prisma.whitelist.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl mb-4">Admin · Whitelist</h1>

      <div className="mb-6">
        <ImportFiles />
      </div>

      {whitelist.length === 0 && <p>No whitelist entries yet.</p>}

      {whitelist.map(item => (
        <div
          key={item.id}
          className="border border-gray-700 p-3 mb-2 rounded"
        >
          <p><b>Wallet:</b> {item.wallet}</p>
          <p>Status: {item.approved ? "Approved ✅" : "Pending ❌"}</p>
        </div>
      ))}
    </div>
  );
}
