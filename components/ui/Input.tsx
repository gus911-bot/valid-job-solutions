import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const base =
  'w-full rounded-xl border border-line bg-surface-200 px-4 py-2.5 text-sm text-cream placeholder:text-muted outline-none transition focus:border-gold/60 focus:ring-4 focus:ring-gold/10 disabled:opacity-60 [color-scheme:dark]';

interface FieldProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & FieldProps
>(({ className, label, error, required, id, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-cream">
        {label} {required && <span className="text-gold-dark">*</span>}
      </label>
    )}
    <input ref={ref} id={id} className={cn(base, error && 'border-red-400 focus:ring-red-200', className)} {...props} />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));
Input.displayName = 'Input';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(({ className, label, error, required, id, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-cream">
        {label} {required && <span className="text-gold-dark">*</span>}
      </label>
    )}
    <textarea ref={ref} id={id} className={cn(base, 'min-h-[120px] resize-y', error && 'border-red-400', className)} {...props} />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & FieldProps
>(({ className, label, error, required, id, children, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-cream">
        {label} {required && <span className="text-gold-dark">*</span>}
      </label>
    )}
    <select ref={ref} id={id} className={cn(base, 'cursor-pointer', error && 'border-red-400', className)} {...props}>
      {children}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));
Select.displayName = 'Select';
