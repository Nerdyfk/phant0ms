import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  return auth.replace("Bearer ", "") === process.env.ADMIN_PASSWORD;
}

export async function POST(req: Request) {
  if (!checkAuth(req)) return unauthorized();

  const buffer = Buffer.from(await req.arrayBuffer());

  let addresses: string[] = [];

  // Try Excel first
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

    addresses = rows
      .flat()
      .map((v) => String(v).trim())
      .filter((v) => v.startsWith("0x"));
  } catch {
    // Fallback to CSV
    const text = buffer.toString();
    addresses = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("0x"));
  }

  let inserted = 0;

  for (const address of addresses) {
    try {
      await prisma.whitelist.create({
        data: {
          address: address.toLowerCase(),
          approved: true,
        },
      });
      inserted++;
    } catch {
      // skip duplicates
    }
  }

  return Response.json({ inserted });
}
