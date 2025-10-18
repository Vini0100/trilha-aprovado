import { NextRequest, NextResponse } from 'next/server';
import { getLogs, clearLogs } from '@/lib/webhookDebug';

const DEBUG_TOKEN = process.env.MP_WEBHOOK_VIEW_TOKEN || 'dev-token';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  const html = url.searchParams.get('html');

  if (token !== DEBUG_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const logs = getLogs(200);

  if (html === '1') {
    // Simple viewer page
    const rows = logs
      .map(
        l =>
          `<tr><td>${l.timestamp}</td><td>${l.level}</td><td>${escapeHtml(l.message)}</td><td><pre>${escapeHtml(JSON.stringify(l.meta || {}, null, 2))}</pre></td></tr>`,
      )
      .join('');
    const page = `<!doctype html><html><head><meta charset="utf-8"><title>Webhook Logs</title><style>body{font-family:system-ui,Segoe UI,Arial}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px;vertical-align:top}pre{white-space:pre-wrap}</style></head><body><h1>Webhook Logs</h1><p><a href="?token=${token}&html=1">Refresh</a> - <a href="?token=${token}&clear=1">Clear</a></p><table><thead><tr><th>Time</th><th>Level</th><th>Message</th><th>Meta</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    return new NextResponse(page, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  if (url.searchParams.get('clear') === '1') {
    clearLogs();
  }

  return NextResponse.json(logs);
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
