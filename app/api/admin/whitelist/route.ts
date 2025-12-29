import { prisma } from "@/lib/prisma";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return false;

  const token = auth.replace("Bearer ", "");
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET(req: Request) {
  if (!checkAuth(req)) return unauthorized();

  const { searchParams } = new URL(req.url);
  const pending = searchParams.get("pending");

  const list = await prisma.whitelist.findMany({
    where: pending === "true" ? { approved: false } : {},
    orderBy: { createdAt: "desc" },
  });

  return Response.json(list);
}

export async function POST(req: Request) {
  if (!checkAuth(req)) return unauthorized();

  const { id, approved } = await req.json();

  await prisma.whitelist.update({
    where: { id },
    data: { approved },
  });

  return Response.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!checkAuth(req)) return unauthorized();

  const { id } = await req.json();

  await prisma.whitelist.delete({
    where: { id },
  });

  return Response.json({ success: true });
}
