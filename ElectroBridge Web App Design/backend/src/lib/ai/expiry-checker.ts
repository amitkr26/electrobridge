import { supabase } from "../supabase.js";

export async function expireOpportunities(): Promise<{ expired: number; updated: number }> {
  if (!supabase) return { expired: 0, updated: 0 };

  const today = new Date().toISOString().split("T")[0];

  const { data: expired, error: fetchError } = await supabase
    .from("opportunities")
    .select("id")
    .eq("is_active", true)
    .lt("deadline", today);

  if (fetchError) throw fetchError;

  if (expired && expired.length > 0) {
    const ids = expired.map(o => o.id);
    const { error: updateError } = await supabase
      .from("opportunities")
      .update({ is_active: false, verification_status: "expired" })
      .in("id", ids);
    if (updateError) throw updateError;
  }

  return { expired: expired?.length || 0, updated: expired?.length || 0 };
}