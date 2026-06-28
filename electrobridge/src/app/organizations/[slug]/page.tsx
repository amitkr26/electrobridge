import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import type { Opportunity } from "@/types";
import OpportunityCard from "@/components/OpportunityCard";

interface Props {
  params: { slug: string };
}

function slugToOrgName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function getOrganizationOpportunities(
  slug: string
): Promise<{ name: string; opportunities: Opportunity[] }> {
  if (!supabaseAdmin?.from) return { name: slugToOrgName(slug), opportunities: [] };

  const today = new Date().toISOString().split("T")[0];

  // Try exact match first, then ilike match
  const orgName = slugToOrgName(slug);
  let { data } = await supabaseAdmin
    .from("opportunities")
    .select("*")
    .eq("is_active", true)
    .eq("organization", orgName)
    .or(`deadline.gte.${today},deadline.is.null`)
    .order("created_at", { ascending: false });

  if (!data || data.length === 0) {
    // Try case-insensitive search
    const { data: data2 } = await supabaseAdmin
      .from("opportunities")
      .select("*")
      .eq("is_active", true)
      .ilike("organization", `%${orgName}%`)
      .or(`deadline.gte.${today},deadline.is.null`)
      .order("created_at", { ascending: false });
    data = data2;
  }

  if (!data || data.length === 0) {
    return { name: orgName, opportunities: [] };
  }

  return { name: data[0].organization, opportunities: data };
}

export async function generateMetadata({ params }: Props) {
  const name = slugToOrgName(params.slug);
  return {
    title: `${name} Opportunities | ElectroBridge`,
    description: `Browse ${name} opportunities on ElectroBridge`,
  };
}

export default async function OrganizationPage({ params }: Props) {
  const { name, opportunities } = await getOrganizationOpportunities(
    params.slug
  );

  if (opportunities.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/opportunities"
        className="inline-flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Opportunities
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          {name}
        </h1>
        <p className="text-text-muted mt-2 text-sm">
          {opportunities.length} active{" "}
          {opportunities.length === 1 ? "opportunity" : "opportunities"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>
    </div>
  );
}
