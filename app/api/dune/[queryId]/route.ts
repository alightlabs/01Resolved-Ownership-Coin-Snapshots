import { NextRequest, NextResponse } from "next/server";
import { getDuneResults } from "@/lib/dune";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  const { queryId } = await params;
  const id = parseInt(queryId, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid query ID" }, { status: 400 });
  }

  const data = await getDuneResults(id);
  if (!data) {
    return NextResponse.json({ error: "Failed to fetch from Dune" }, { status: 502 });
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "s-maxage=7200, stale-while-revalidate=3600" },
  });
}
