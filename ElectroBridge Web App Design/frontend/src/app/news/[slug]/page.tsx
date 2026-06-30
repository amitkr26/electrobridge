'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NEWS_ITEMS } from '@/data/news';

export default function NewsDetailPage() {
  const params = useParams();
  const slug = (params.slug as string) || '1';
  const article = NEWS_ITEMS.find((n) => n.id === Number(slug)) || NEWS_ITEMS[0];

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <div className="max-w-[800px] mx-auto px-4 py-10">
        <Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-white mb-6 transition-colors">
          <ChevronRight size={14} className="rotate-180" /> Back to News
        </Link>

        <article>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: article.sourceColor }} />
            <span className="text-sm font-semibold" style={{ color: article.sourceColor }}>{article.source}</span>
            <span className="text-xs text-[#94A3B8]">{article.time}</span>
            <Badge variant="gray" size="xs">{article.category}</Badge>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{article.headline}</h1>
          <p className="text-lg text-[#94A3B8] leading-relaxed mb-8">{article.summary}</p>

          <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-6 mb-8">
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              This is a detailed view of the news article. In the production version, full article content would be displayed here, fetched from the database or via the RSS source. The AI-powered summarization and relevance filtering would also be applied to ensure high-quality content.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((t) => (
              <Badge key={t} variant="default" size="sm">#{t}</Badge>
            ))}
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1A2438] border border-[#1F2937] text-sm text-white hover:border-[#00E5FF]/30 transition-colors"
          >
            <ExternalLink size={14} /> Read full article on {article.source}
          </a>
        </article>
      </div>
    </div>
  );
}
