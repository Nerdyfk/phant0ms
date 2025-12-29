import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const { address, twitter } = await req.json();

  if (!address || !twitter) {
    return Response.json(
      { error: "Wallet address and Twitter username are required" },
      { status: 400 }
    );
  }

  const ip =
    headers().get("x-forwarded-for")?.split(",")[0] ||
    headers().get("x-real-ip") ||
    "unknown";

  // ❌ basic anti-spam: block if same IP already submitted
  const existing = await prisma.whitelist.findFirst({
    where: { ip },
  });

  if (existing) {
    return Response.json(
      { message: "Submission limit reached for this IP" },
      { status: 429 }
    );
  }

  try {
    await prisma.whitelist.create({
      data: {
        address: address.toLowerCase(),
        twitter: twitter.replace("@", "").toLowerCase(),
        ip,
      },
    });

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { message: "Address already submitted" },
      { status: 409 }
    );
  }
}
