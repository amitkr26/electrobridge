const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function generateStaticParams() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API}/organizations`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('API error');
    const { data } = await res.json();
    return (data || []).map((o: any) => ({ slug: o.slug }));
  } catch {
    return [
      { slug: 'isro' },
      { slug: 'iisc' },
      { slug: 'intel' },
      { slug: 'tata-motors' },
      { slug: 'tifr' },
      { slug: 'drdo' },
    ];
  }
}

export default function OrgSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}