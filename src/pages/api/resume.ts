import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  const runtime = locals.runtime as { env?: { ADMIN_TOKEN?: string; RESUME?: { put: (key: string, value: string) => Promise<void> } } };
  if (!runtime.env?.ADMIN_TOKEN || token !== runtime.env.ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
  }
  const data = await request.json();
  if (runtime.env.RESUME) await runtime.env.RESUME.put('resume', JSON.stringify(data));
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};