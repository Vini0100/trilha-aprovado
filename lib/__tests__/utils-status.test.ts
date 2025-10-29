import { describe, it, expect } from 'vitest';
import { formatEssayStatus, badgeVariantForEssayStatus } from '@/lib/utils';

describe('formatEssayStatus', () => {
  it('formata status conhecidos', () => {
    expect(formatEssayStatus('pending_payment')).toBe('Pagamento pendente');
    expect(formatEssayStatus('aguardando_revisao')).toBe('Aguardando revisão');
    expect(formatEssayStatus('finalizada')).toBe('Finalizada');
  });

  it('retorna o próprio valor para status desconhecidos', () => {
    expect(formatEssayStatus('outro_status')).toBe('outro_status');
  });
});

describe('badgeVariantForEssayStatus', () => {
  it('retorna variante correta para cada status', () => {
    expect(badgeVariantForEssayStatus('pending_payment')).toBe('outline');
    expect(badgeVariantForEssayStatus('aguardando_revisao')).toBe('secondary');
    expect(badgeVariantForEssayStatus('finalizada')).toBe('default');
  });

  it('usa outline como padrão para desconhecidos', () => {
    expect(badgeVariantForEssayStatus('xpto' as any)).toBe('outline');
  });
});
