'use client';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Indent } from 'lucide-react';

interface EssayEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readonly?: boolean;
  placeholder?: string;
}

const TOTAL_LINES = 30;
const LINE_HEIGHT = 2.5; // rem (deve casar com o line-height do textarea)

export function EssayEditor({ value, onChange, readonly = false, placeholder }: EssayEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [fontSize, setFontSize] = useState(18); // tamanho inicial em px

  // Sem contador de linhas: mantemos apenas o comportamento de edição

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
  };

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(prev => prev + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 14) setFontSize(prev => prev - 2);
  };

  const insertIndent = () => {
    if (!textareaRef.current || readonly) return;

    const ta = textareaRef.current;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = ta.value;

    const indent = '    '; // 4 espaços

    // Descobre início da linha do início da seleção
    const lineStart = text.lastIndexOf('\n', start - 1) + 1; // -1 => 0
    const lineEndIdx = end; // até onde aplicar (aplica por linhas)
    const selected = text.slice(lineStart, lineEndIdx);

    const lines = selected.split('\n');
    const indented = lines.map(l => indent + l).join('\n');

    const newValue = text.slice(0, lineStart) + indented + text.slice(lineEndIdx);
    onChange?.(newValue);

    // Ajusta seleção para cobrir o mesmo conteúdo após indentação
    const addedPerLine = indent.length;
    const lineCountSel = lines.length;
    const newStart = start + addedPerLine; // início move 4 espaços
    const newEnd = end + addedPerLine * lineCountSel; // fim cresce 4 por linha

    setTimeout(() => {
      ta.selectionStart = newStart;
      ta.selectionEnd = newEnd;
      ta.focus();
    }, 0);
  };

  // Suporte à tecla TAB para indentar e Shift+Tab para desindentar
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readonly) return;
    if (e.key === 'Tab') {
      e.preventDefault();

      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const text = ta.value;
      const indent = '    ';

      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      const lineEndIdx = end;
      const selected = text.slice(lineStart, lineEndIdx);
      const lines = selected.split('\n');

      if (e.shiftKey) {
        // Desindenta (remove até 4 espaços no começo)
        const unindentedLines = lines.map(l =>
          l.startsWith(indent) ? l.slice(indent.length) : l.replace(/^ {1,4}/, ''),
        );
        const replaced = unindentedLines.join('\n');
        const newValue = text.slice(0, lineStart) + replaced + text.slice(lineEndIdx);
        onChange?.(newValue);

        const removedEach = lines.map(l =>
          l.startsWith(indent) ? indent.length : Math.min(4, l.match(/^ +/)?.[0]?.length ?? 0),
        );
        const totalRemoved = removedEach.reduce((a, b) => a + b, 0);
        setTimeout(() => {
          ta.selectionStart = Math.max(lineStart, start - removedEach[0]);
          ta.selectionEnd = end - totalRemoved;
          ta.focus();
        }, 0);
      } else {
        // Indenta
        const indented = lines.map(l => indent + l).join('\n');
        const newValue = text.slice(0, lineStart) + indented + text.slice(lineEndIdx);
        onChange?.(newValue);
        setTimeout(() => {
          const lineCountSel = lines.length;
          ta.selectionStart = start + indent.length;
          ta.selectionEnd = end + indent.length * lineCountSel;
          ta.focus();
        }, 0);
      }
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Toolbar de formatação */}
      {!readonly && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-100 rounded-lg border flex-wrap">
          <div className="flex items-center gap-1 border-r pr-3">
            <span className="text-xs text-gray-600 mr-2">Fonte:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={decreaseFontSize}
              disabled={fontSize <= 14}
              title="Diminuir fonte"
            >
              A-
            </Button>
            <span className="text-sm font-medium w-8 text-center">{fontSize}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={increaseFontSize}
              disabled={fontSize >= 24}
              title="Aumentar fonte"
            >
              A+
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={insertIndent}
            title="Inserir indentação de parágrafo"
            className="gap-2"
          >
            <Indent className="w-4 h-4" />
            Indentar
          </Button>
          <span className="text-xs text-gray-600 ml-auto">
            Use <strong>Enter</strong> para criar parágrafos. Use <strong>Indentar</strong> ou
            <strong> Tab</strong> para começar parágrafo.
          </span>
        </div>
      )}

      {/* Container com visual de papel */}
      <div className="relative bg-white shadow-lg border border-gray-300 rounded-sm overflow-hidden">
        {/* Margem esquerda */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-red-50 to-transparent border-r-2 border-red-200 pointer-events-none z-10" />

        {/* Linhas pautadas */}
        <div className="absolute inset-0 pointer-events-none z-0 pt-3">
          {Array.from({ length: TOTAL_LINES }).map((_, i) => (
            <div
              key={i}
              className="border-b border-blue-200"
              style={{
                height: `${LINE_HEIGHT}rem`,
              }}
            />
          ))}
        </div>

        {/* Área de texto */}
        <div className="relative z-20 pl-20 pr-8 py-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            readOnly={readonly}
            placeholder={readonly ? '' : placeholder}
            className={cn(
              'w-full bg-transparent resize-none outline-none',
              'font-serif text-gray-900 placeholder:text-gray-400',
              readonly && 'cursor-default',
            )}
            style={{
              height: `${TOTAL_LINES * LINE_HEIGHT}rem`,
              lineHeight: `${LINE_HEIGHT}rem`,
              fontSize: `${fontSize}px`,
            }}
          />
        </div>

        {/* Contador de linhas removido a pedido */}
      </div>

      {/* Instruções movidas para a toolbar */}
    </div>
  );
}
