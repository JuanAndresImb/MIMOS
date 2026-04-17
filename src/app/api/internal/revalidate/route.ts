import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as { path?: string };
  if (!body.path || typeof body.path !== "string") {
    return Response.json({ error: "Missing path" }, { status: 400 });
  }

  revalidatePath(body.path);
  return Response.json({ revalidated: true, path: body.path });
}
