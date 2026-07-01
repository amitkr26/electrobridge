const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function generateStaticParams() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API}/news?limit=50`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('API error');
    const { data } = await res.json();
    return (data || []).map((n: any) => ({ slug: n.slug || String(n.id) }));
  } catch {
    return [
      { slug: 'india-semiconductor-mission-incentive' },
      { slug: 'isro-chandrayaan-4-cabinet-approval' },
      { slug: 'iisc-cryogenic-quantum-processor' },
      { slug: 'drdo-hypersonic-scramjet-test' },
      { slug: 'iit-bombay-intel-ai-research-lab' },
    ];
  }
}

export default function NewsSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}