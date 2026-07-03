import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { comment } = await request.json();

  const { data: existing } = await supabase
    .from("feed_post_reposts")
    .select("id")
    .eq("post_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("feed_post_reposts").delete().eq("id", existing.id);
    return NextResponse.json({ reposted: false });
  }

  await supabase.from("feed_post_reposts").insert({
    post_id: id,
    user_id: user.id,
    comment: comment || null,
  });

  return NextResponse.json({ reposted: true }, { status: 201 });
}
