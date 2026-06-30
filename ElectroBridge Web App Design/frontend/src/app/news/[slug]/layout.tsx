import { FALLBACK_NEWS } from '@/data/news';

export function generateStaticParams() {
  return FALLBACK_NEWS.map((n) => ({ slug: String(n.id) }));
}

export default function NewsSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
