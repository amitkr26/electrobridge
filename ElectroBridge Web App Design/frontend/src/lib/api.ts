const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),

  opportunities: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ data: any[]; total: number }>(`/opportunities${qs}`);
    },
    get: (id: string) => request<{ data: any }>(`/opportunities/${id}`),
  },

  news: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ data: any[]; total: number }>(`/news${qs}`);
    },
    get: (slug: string) => request<{ data: any }>(`/news/${slug}`),
  },

  ai: {
    chat: (message: string, history?: any[]) => request<{ data: { message: string; provider: string } }>('/ai/chat', { method: 'POST', body: JSON.stringify({ message, history }) }),
    match: (skills: string[]) => request<{ data: { matches: any[] } }>('/ai/match', { method: 'POST', body: JSON.stringify({ skills }) }),
    search: (q: string) => request<{ data: any[]; total: number }>(`/ai/search?q=${encodeURIComponent(q)}`),
    summarize: (text: string) => request<{ data: { summary: string; keyPoints: string[] } }>('/ai/summarize', { method: 'POST', body: JSON.stringify({ text }) }),
  },

  organizations: {
    list: () => request<{ data: any[] }>('/organizations'),
    get: (slug: string) => request<{ data: any[]; total: number }>(`/organizations/${slug}`),
  },

  subscribe: (email: string, keywords?: string[], categories?: string[]) =>
    request<{ data: { id: string } }>('/subscribe', { method: 'POST', body: JSON.stringify({ email, keywords, categories }) }),

  unsubscribe: (email: string) =>
    request<{ success: boolean }>('/subscribe/unsubscribe', { method: 'POST', body: JSON.stringify({ email }) }),
};