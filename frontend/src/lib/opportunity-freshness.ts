export interface FreshnessMeta {
  status: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "UNKNOWN";
  daysRemaining: number | null;
  formattedDeadline: string;
  freshnessLabel: string;
  badgeColor: { bg: string; text: string; border: string };
}

export function evaluateOpportunityFreshness(
  deadline?: string | null,
  lastVerified?: string | null
): FreshnessMeta {
  const UNKNOWN: FreshnessMeta = {
    status: "UNKNOWN",
    daysRemaining: null,
    formattedDeadline: deadline || "Not specified",
    freshnessLabel: "Unknown",
    badgeColor: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
  };

  if (!deadline) return UNKNOWN;

  const deadlineDate = new Date(deadline);
  if (isNaN(deadlineDate.getTime())) return UNKNOWN;

  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      status: "EXPIRED",
      daysRemaining,
      formattedDeadline: deadline,
      freshnessLabel: "Expired",
      badgeColor: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
    };
  }

  if (daysRemaining <= 7) {
    return {
      status: "EXPIRING_SOON",
      daysRemaining,
      formattedDeadline: deadline,
      freshnessLabel: `${daysRemaining}d left`,
      badgeColor: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
    };
  }

  return {
    status: "ACTIVE",
    daysRemaining,
    formattedDeadline: deadline,
    freshnessLabel: `${daysRemaining}d left`,
    badgeColor: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  };
}
