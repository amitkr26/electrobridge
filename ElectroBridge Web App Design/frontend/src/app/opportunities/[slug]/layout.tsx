const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function generateStaticParams() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API}/opportunities?limit=50`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('API error');
    const { data } = await res.json();
    return (data || []).map((o: any) => ({ slug: String(o.id) }));
  } catch {
    return [
      { slug: 'ac305d5c-abee-4af8-9514-ec971728a349' },
      { slug: '1301e276-0d27-4621-90a2-de7276c3d99c' },
      { slug: '01b3b6ec-449e-4787-82b2-b9efe100f970' },
      { slug: 'b49ab93c-139b-405b-bbbb-ee4868a47288' },
      { slug: '39368138-b104-4d08-a9c6-90fcbe908845' },
    ];
  }
}

export default function OppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}