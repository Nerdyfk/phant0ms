import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { address } = await req.json();

  if (!address) {
    return Response.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  const entry = await prisma.whitelist.findUnique({
    where: {
      address: address.toLowerCase(),
    },
  });

  return Response.json({
    whitelisted: !!entry,
    approved: entry?.approved ?? false,
  });
}
