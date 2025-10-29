import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ========= Essay status helpers =========
export const ESSAY_STATUS = {
  pending_payment: { label: 'Pagamento pendente', badge: 'outline' as const },
  aguardando_revisao: { label: 'Aguardando revisão', badge: 'secondary' as const },
  finalizada: { label: 'Finalizada', badge: 'default' as const },
} as const;

export type EssayStatus = keyof typeof ESSAY_STATUS | (string & {});

export function formatEssayStatus(status: EssayStatus): string {
  const key = String(status) as keyof typeof ESSAY_STATUS;
  return ESSAY_STATUS[key]?.label ?? String(status);
}

export function badgeVariantForEssayStatus(
  status: EssayStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const key = String(status) as keyof typeof ESSAY_STATUS;
  return ESSAY_STATUS[key]?.badge ?? 'outline';
}
