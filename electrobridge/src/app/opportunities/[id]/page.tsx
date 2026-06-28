import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Currency, Calendar, ExternalLink, Clock } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDate, isExpired } from "@/lib/utils";
import CategoryBadge from "@/components/CategoryBadge";
import DeadlineCountdown from "@/components/DeadlineCountdown";
import ApplyButton from "@/components/ApplyButton";
import ShareButtons from "@/components/ShareButtons";
import SimilarOpportunities from "@/components/SimilarOpportunities";
import CopyLinkButton from "@/components/CopyLinkButton";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  if (!supabaseAdmin?.from) return { title: "Opportunity | ElectroBridge" };

  const { data: opportunity } = await supabaseAdmin
    .from("opportunities")
    .select("title, organization, location, deadline, eligibility")
    .eq("id", params.id)
    .single();

  if (!opportunity) return { title: "Opportunity Not Found" };

  const desc = [
    opportunity.title,
    "at",
    opportunity.organization,
    opportunity.location ? `— ${opportunity.location}` : "",
    opportunity.deadline ? `| Deadline: ${new Date(opportunity.deadline).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}` : "",
    opportunity.eligibility ? `| Eligibility: ${opportunity.eligibility}` : "",
    "| ElectroBridge",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title: `${opportunity.title} - ${opportunity.organization} | ElectroBridge`,
    description: desc,
  };
}

export default async function OpportunityDetailPage({ params }: Props) {
  if (!supabaseAdmin?.from) notFound();

  const { data: opportunity, error } = await supabaseAdmin
    .from("opportunities")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !opportunity) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/opportunities"
        className="inline-flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Opportunities
      </Link>

      {opportunity.deadline && isExpired(opportunity.deadline) && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 mb-4 text-center">
          <p className="text-red-400 text-sm font-medium">
            This opportunity has expired. The deadline was {formatDate(opportunity.deadline)}.
          </p>
        </div>
      )}

      <div className="bg-navy-light border border-gray-800 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <CategoryBadge category={opportunity.category} />
              {opportunity.deadline && (
                <DeadlineCountdown deadline={opportunity.deadline} />
              )}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
              {opportunity.title}
            </h1>
            <p className="text-text-muted mt-1">
              {opportunity.organization}
            </p>
            {opportunity.created_at && (
              <p className="flex items-center gap-1 text-text-muted text-xs mt-2">
                <Clock className="w-3 h-3" />
                Last updated: {formatDate(opportunity.created_at)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-800/50 rounded-lg mb-6">
          {opportunity.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan" />
              <div>
                <p className="text-text-muted text-xs">Location</p>
                <p className="text-text-primary text-sm font-medium">
                  {opportunity.location}
                </p>
              </div>
            </div>
          )}
          {opportunity.stipend && (
            <div className="flex items-center gap-2">
              <Currency className="w-4 h-4 text-cyan" />
              <div>
                <p className="text-text-muted text-xs">Stipend/Salary</p>
                <p className="text-text-primary text-sm font-medium">
                  {opportunity.stipend}
                </p>
              </div>
            </div>
          )}
          {opportunity.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan" />
              <div>
                <p className="text-text-muted text-xs">Deadline</p>
                <p className="text-text-primary text-sm font-medium">
                  {formatDate(opportunity.deadline)}
                </p>
              </div>
            </div>
          )}
          {opportunity.eligibility && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 text-cyan flex items-center justify-center">
                <span className="text-[10px] font-bold">E</span>
              </div>
              <div>
                <p className="text-text-muted text-xs">Eligibility</p>
                <p className="text-text-primary text-sm font-medium">
                  {opportunity.eligibility}
                </p>
              </div>
            </div>
          )}
        </div>

        {opportunity.description && (
          <div className="mb-6">
            <h2 className="font-display text-lg font-bold text-text-primary mb-3">
              Description
            </h2>
            <p className="text-text-muted text-sm leading-relaxed">
              {opportunity.description}
            </p>
          </div>
        )}

        {opportunity.tags && opportunity.tags.length > 0 && (
          <div className="mb-6">
            <h2 className="font-display text-sm font-bold text-text-primary mb-3">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {opportunity.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/opportunities?search=${tag}`}
                  className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-text-muted text-xs hover:border-cyan/50 hover:text-cyan transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {opportunity.apply_link && (
          <div className="flex items-center gap-3 flex-wrap">
            <ApplyButton
              applyLink={opportunity.apply_link}
              opportunityId={opportunity.id!}
            />
            <a
              href={`/api/calendar-export/${opportunity.id}`}
              className="inline-flex items-center gap-2 border border-gray-700 text-text-primary font-medium rounded-lg px-4 py-2.5 text-sm hover:border-cyan/50 transition-colors"
              download
            >
              📅 Add to Calendar
            </a>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3 flex-wrap">
          <ShareButtons
            title={opportunity.title}
            organization={opportunity.organization}
            deadline={opportunity.deadline}
            opportunityUrl={`https://electrobridge.vercel.app/opportunities/${opportunity.id}`}
          />
          <CopyLinkButton url={`https://electrobridge.vercel.app/opportunities/${opportunity.id}`} />
        </div>
      </div>

      <SimilarOpportunities
        currentId={opportunity.id}
        tags={opportunity.tags || []}
      />
    </div>
  );
}
