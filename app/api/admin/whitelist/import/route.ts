import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import pdf from "pdf-parse";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    let wallets: string[] = [];

    /* ---------- CSV ---------- */
    if (fileName.endsWith(".csv")) {
      const text = buffer.toString("utf-8");
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

      wallets = (parsed.data as any[])
        .map(row => row.wallet ?? row.address)
        .filter(Boolean);

    /* ---------- EXCEL ---------- */
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<any>(sheet);

      wallets = json
        .map(row => row.wallet ?? row.address)
        .filter(Boolean);

    /* ---------- PDF ---------- */
    } else if (fileName.endsWith(".pdf")) {
      const data = await pdf(buffer);
      wallets = data.text
        .split(/\s+/)
        .filter(w => w.startsWith("0x") && w.length >= 40);

    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    if (!wallets.length) {
      return NextResponse.json(
        { error: "No wallet addresses found" },
        { status: 400 }
      );
    }

    const rows = wallets.map(wallet => ({
      wallet,
      approved: false,
    }));

    await prisma.whitelist.createMany({
      data: rows,
      skipDuplicates: true,
    });

    return NextResponse.json({
      imported: rows.length,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Import failed" },
      { status: 500 }
    );
  }
}
