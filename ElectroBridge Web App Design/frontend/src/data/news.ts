import { api } from '@/lib/api';

export interface NewsData {
  id: number;
  source: string;
  sourceColor: string;
  time: string;
  headline: string;
  summary: string;
  tags: string[];
  category: string;
}

const SOURCE_COLORS: Record<string, string> = {
  'IEEE Spectrum': '#00E5FF',
  'EE Times': '#3B82F6',
  'Semiconductor Today': '#10B981',
  'Digit India': '#F59E0B',
  'EDN Network': '#8B5CF6',
  'Electronic Design': '#EF4444',
  default: '#00E5FF',
};

export const FALLBACK_NEWS: NewsData[] = [
  { id: 1, source: 'IEEE Spectrum', sourceColor: '#00E5FF', time: '2h ago', headline: 'TSMC Announces 2nm Node Production Ramp with Backside Power Delivery', summary: 'TSMC confirms volume production of N2 node begins Q4 2025, featuring industry-first backside power delivery and nanosheet transistors.', tags: ['TSMC', '2nm', 'Semiconductor', 'Foundry'], category: 'Semiconductor' },
  { id: 2, source: 'EE Times', sourceColor: '#3B82F6', time: '4h ago', headline: 'NVIDIA Blackwell Ultra B300 Delivers 1.5x AI Training Speed Over B200', summary: 'New benchmarks from MLCommons show NVIDIA\'s Blackwell Ultra architecture outperforms its predecessor with 288GB HBM3e.', tags: ['NVIDIA', 'AI Chips', 'HPC', 'GPU'], category: 'AI Chips' },
  { id: 3, source: 'Semiconductor Today', sourceColor: '#10B981', time: '6h ago', headline: 'IIT Bombay Researchers Demonstrate Room-Temperature Quantum Dot Single Photon Emitter', summary: 'A team from IIT Bombay\'s CRNTS has fabricated colloidal InP quantum dots capable of on-demand single photon emission at 300K.', tags: ['Quantum Dots', 'Photonics', 'IIT Bombay', 'Research'], category: 'Research' },
  { id: 4, source: 'Digit India', sourceColor: '#F59E0B', time: '8h ago', headline: 'India\'s Semiconductor Mission Approves ₹76,000 Cr Fab in Dholera SEZ', summary: 'The Union Cabinet has greenlit TATA Electronics\' proposed 28nm fab in Gujarat\'s Dholera SEZ, expected to generate over 20,000 direct jobs.', tags: ['India', 'Fab', 'Policy', 'TATA'], category: 'India' },
  { id: 5, source: 'EDN Network', sourceColor: '#8B5CF6', time: '12h ago', headline: 'VLSI Design Jobs Surge 34% YoY in India as Global Chip Giants Expand R&D', summary: 'Hiring data from NASSCOM shows a 34% jump in VLSI/ASIC design roles in India in H1 2025.', tags: ['VLSI', 'Jobs', 'India', 'Industry'], category: 'Jobs' },
];

export async function getNews(params?: Record<string, string>): Promise<NewsData[]> {
  try {
    const res = await api.news.list(params);
    return (res.data || []).map((n: any) => ({
      id: n.id || parseInt(n.slug || '0'),
      source: n.source || 'Unknown',
      sourceColor: SOURCE_COLORS[n.source] || SOURCE_COLORS.default,
      time: n.published_at ? timeAgo(new Date(n.published_at)) : 'Recently',
      headline: n.title,
      summary: n.summary || '',
      tags: n.tags || [],
      category: n.category || 'Semiconductor',
    }));
  } catch {
    return FALLBACK_NEWS;
  }
}

export async function getNewsArticle(slug: string): Promise<NewsData | null> {
  try {
    const res = await api.news.get(slug);
    const n = res.data;
    if (!n) return FALLBACK_NEWS.find((f) => f.id === Number(slug)) || null;
    return {
      id: n.id || parseInt(n.slug || '0'),
      source: n.source || 'Unknown',
      sourceColor: SOURCE_COLORS[n.source] || SOURCE_COLORS.default,
      time: n.published_at ? timeAgo(new Date(n.published_at)) : 'Recently',
      headline: n.title,
      summary: n.summary || '',
      tags: n.tags || [],
      category: n.category || 'Semiconductor',
    };
  } catch {
    return FALLBACK_NEWS.find((f) => f.id === Number(slug)) || null;
  }
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export { FALLBACK_NEWS as NEWS_ITEMS };