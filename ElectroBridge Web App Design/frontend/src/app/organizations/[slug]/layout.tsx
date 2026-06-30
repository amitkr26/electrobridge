import { FALLBACK_OPPORTUNITIES } from '@/data/opportunities';

export function generateStaticParams() {
  const orgs = [...new Set(FALLBACK_OPPORTUNITIES.map((o) => o.org.split('—')[0].trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')))];
  return orgs.map((slug) => ({ slug }));
}

export default function OrganizationSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
