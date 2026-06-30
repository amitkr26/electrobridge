import { FALLBACK_OPPORTUNITIES } from '@/data/opportunities';

export function generateStaticParams() {
  return FALLBACK_OPPORTUNITIES.map((o) => ({ slug: String(o.id) }));
}

export default function OpportunitySlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
