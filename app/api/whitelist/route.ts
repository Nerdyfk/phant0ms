import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { wallet, twitter } = await req.json();

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet required" },
        { status: 400 }
      );
    }

    const entry = await prisma.whitelist.create({
      data: {
        wallet,
        twitter,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Wallet already exists or DB error" },
      { status: 409 }
    );
  }
}
