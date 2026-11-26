import { brandIcon } from "@/lib/brand-icon";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size } = await params;

  if (size !== "192" && size !== "512") {
    return new Response("Not found", { status: 404 });
  }

  return brandIcon(Number(size));
}