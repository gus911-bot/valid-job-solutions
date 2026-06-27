'use client';

import { useRef, useState, type DragEvent } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CV_ACCEPT_ATTR, CV_EXT_LABEL, CV_MAX_LABEL } from '@/lib/cv';

interface FileDropzoneProps {
  label: string;
  hint?: string;
  browseLabel?: string;
  file: File | null;
  error?: string | null;
  disabled?: boolean;
  onSelect: (file: File | null) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function FileDropzone({
  label,
  hint,
  browseLabel,
  file,
  error,
  disabled,
  onSelect,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onSelect(dropped);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-cream">{label}</label>

      {!file ? (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()
          }
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition',
            dragging
              ? 'border-gold bg-gold/5'
              : 'border-line hover:border-gold/60 hover:bg-gold/5',
            disabled && 'cursor-not-allowed opacity-60',
            error && 'border-red-400',
          )}
        >
          <UploadCloud className="h-7 w-7 text-gold-dark" />
          <p className="text-sm text-cream">
            {browseLabel ?? 'Glissez votre fichier ici, ou parcourir'}
          </p>
          <p className="text-xs text-muted">
            {CV_EXT_LABEL} — max {CV_MAX_LABEL}
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-200 px-4 py-3">
          <span className="flex min-w-0 items-center gap-3">
            <FileText className="h-5 w-5 shrink-0 text-gold-dark" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-cream">
                {file.name}
              </span>
              <span className="text-xs text-muted">{formatSize(file.size)}</span>
            </span>
          </span>
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            disabled={disabled}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
          >
            <X className="h-3.5 w-3.5" /> Retirer
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={CV_ACCEPT_ATTR}
        className="hidden"
        disabled={disabled}
        onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
      />

      {hint && !error && <p className="text-xs text-gold-dark">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
