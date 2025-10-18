type WebhookLog = {
  id: string;
  timestamp: string;
  level: 'info' | 'error' | 'debug';
  message: string;
  meta?: Record<string, any>;
};

const MAX_LOGS = 200;
const logs: WebhookLog[] = [];

export function pushLog(entry: Omit<WebhookLog, 'id' | 'timestamp'>) {
  const id = String(Date.now()) + '-' + Math.random().toString(36).slice(2, 9);
  const log: WebhookLog = { id, timestamp: new Date().toISOString(), ...entry };
  logs.unshift(log);
  if (logs.length > MAX_LOGS) logs.pop();
}

export function getLogs(limit = 100) {
  return logs.slice(0, Math.min(limit, logs.length));
}

export function clearLogs() {
  logs.length = 0;
}

export type { WebhookLog };
